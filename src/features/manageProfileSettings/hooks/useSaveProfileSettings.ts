import { useQueryClient } from '@tanstack/react-query';

import { createProfileSettings, saveProfileSettings } from '@/common/api/profiles.api';
import { ApiErrorCodes } from '@/common/constants/api.constants';
import { StatusType } from '@/common/constants/status.constants';
import { checkHasErrorOfCodeType } from '@/common/helpers/api.helper';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { usePreferredProfileSettings, usePreferredProfileSettingsMutations } from '@/features/profiles';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState } from '@/store';

import { determinePreferredAction, determinePreferredSettingsAction, generateSettings } from '../utils';

export const useSaveProfileSettings = () => {
  const queryClient = useQueryClient();
  const { preferredProfiles, setPreferredProfiles } = useProfileState(['preferredProfiles', 'setPreferredProfiles']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const {
    isCreating,
    isPreferredProfileSettings,
    isSettingsActive,
    isTypeDefaultProfile,
    selectedProfile,
    selectedProfileSettingsMeta,
    unusedComponents,
    selectedComponents,
    settingsName,
    setIsCreating,
    setIsModified,
    setProfileSettings,
    setSelectedProfileSettingsMeta,
  } = useManageProfileSettingsState([
    'isCreating',
    'isPreferredProfileSettings',
    'isSettingsActive',
    'isTypeDefaultProfile',
    'selectedProfile',
    'selectedProfileSettingsMeta',
    'unusedComponents',
    'selectedComponents',
    'settingsName',
    'setIsCreating',
    'setIsModified',
    'setProfileSettings',
    'setSelectedProfileSettingsMeta',
  ]);
  const { data: preferredProfileSettings } = usePreferredProfileSettings(selectedProfile?.id);
  const { removePreferredProfileSettings, updatePreferredProfileSettings } = usePreferredProfileSettingsMutations();

  const saveAndSetPreferred = async () => {
    const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, isTypeDefaultProfile);

    if (preferredAction) {
      try {
        await preferredAction(selectedProfile, preferredProfiles, setPreferredProfiles);
      } catch (error) {
        logger.error('Failed to set preferred profile:', error);
        addStatusMessagesItem?.(
          UserNotificationFactory.createMessage(StatusType.error, 'ld.error.profileSaveAsPreferred'),
        );
      }
    }
  };

  const saveAndSetSettings = async () => {
    const settingsToSave = generateSettings(
      selectedProfile.id,
      selectedComponents,
      unusedComponents,
      isSettingsActive,
      settingsName,
    );
    let settingsMeta: ProfileSettingsMeta;

    try {
      if (!isCreating && selectedProfileSettingsMeta) {
        settingsMeta = selectedProfileSettingsMeta;
        await saveProfileSettings(selectedProfile.id, settingsMeta.id, settingsToSave);
      } else {
        settingsMeta = await createProfileSettings(selectedProfile.id, settingsToSave);
        setIsCreating(false);
      }
      setProfileSettings({ ...settingsToSave, missingFromSettings: [], id: settingsMeta.id });
      queryClient.refetchQueries({ queryKey: ['profileSettingsMeta', String(selectedProfile.id)] });
      queryClient.refetchQueries({ queryKey: ['profileSettings', String(selectedProfile.id), settingsMeta.id] });
      setSelectedProfileSettingsMeta(settingsMeta);
      return settingsMeta;
    } catch (error) {
      logger.error('Failed to set profile settings:', error);
      let errKey = 'ld.error.saveProfileSettings';
      if ((error as ApiError).errors) {
        if (checkHasErrorOfCodeType(error as ApiError, ApiErrorCodes.ProfileSettingsNameNotUnique)) {
          errKey = `ld.${ApiErrorCodes.ProfileSettingsNameNotUnique}`;
        } else if (checkHasErrorOfCodeType(error as ApiError, ApiErrorCodes.NotBlank)) {
          errKey = 'ld.error.profileSettingsNameNotBlank';
        }
      }
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, errKey));
    }
  };

  const saveAndSetPreferredProfileSetting = async (settingsMeta: ProfileSettingsMeta | undefined) => {
    if (settingsMeta) {
      determinePreferredSettingsAction({
        profileId: selectedProfile.id,
        profileSettingsId: settingsMeta.id,
        preferredProfileSettings,
        isPreferredProfileSettings,
        remove: removePreferredProfileSettings,
        update: updatePreferredProfileSettings,
      });
    }
    // If an undefined settingsMeta is being passed in, there was an error preceding it,
    // so no additional error message should be shown. Do nothing, the user needs to
    // fix something else before this will be tried again.
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      await saveAndSetPreferred();
      const settingsMeta = await saveAndSetSettings();
      await saveAndSetPreferredProfileSetting(settingsMeta);
      setIsModified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveSettings,
  };
};
