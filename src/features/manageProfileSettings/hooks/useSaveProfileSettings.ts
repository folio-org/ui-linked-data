import { useQueryClient } from '@tanstack/react-query';

import { createProfileSettings, saveProfileSettings } from '@/common/api/profiles.api';
import { ApiErrorCodes } from '@/common/constants/api.constants';
import { StatusType } from '@/common/constants/status.constants';
import { checkHasErrorOfCodeType } from '@/common/helpers/api.helper';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState } from '@/store';

import { determinePreferredAction, generateSettings } from '../utils';

export const useSaveProfileSettings = () => {
  const queryClient = useQueryClient();
  const { preferredProfiles, setPreferredProfiles } = useProfileState(['preferredProfiles', 'setPreferredProfiles']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const {
    isCreating,
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
    const settingsToSave = generateSettings(selectedComponents, unusedComponents, isSettingsActive, settingsName);
    let settingsMeta: ProfileSettingsMeta;

    try {
      if (!isCreating && selectedProfileSettingsMeta) {
        settingsMeta = selectedProfileSettingsMeta;
        await saveProfileSettings(selectedProfile.id, settingsMeta.id, settingsToSave);
      } else {
        settingsMeta = await createProfileSettings(selectedProfile.id, settingsToSave);
        setIsCreating(false);
      }
      setProfileSettings({ ...settingsToSave, missingFromSettings: [] });
      queryClient.refetchQueries({ queryKey: ['profileSettingsMeta', String(selectedProfile.id)] });
      queryClient.refetchQueries({ queryKey: ['profileSettings', String(selectedProfile.id), settingsMeta.id] });
      setSelectedProfileSettingsMeta(settingsMeta);
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

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      await saveAndSetPreferred();
      await saveAndSetSettings();
      setIsModified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveSettings,
  };
};
