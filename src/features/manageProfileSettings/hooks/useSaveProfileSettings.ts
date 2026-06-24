import { useQueryClient } from '@tanstack/react-query';

import { createProfileSettings, saveProfileSettings } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';
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
    isSettingsActive,
    isTypeDefaultProfile,
    selectedProfile,
    selectedProfileSettingsMeta,
    unusedComponents,
    selectedComponents,
    settingsName,
    setIsModified,
    setProfileSettings,
    setSelectedProfileSettingsMeta,
  } = useManageProfileSettingsState([
    'isSettingsActive',
    'isTypeDefaultProfile',
    'selectedProfile',
    'selectedProfileSettingsMeta',
    'unusedComponents',
    'selectedComponents',
    'settingsName',
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

  const saveAndSetSettings = async (name?: string) => {
    const settingsToSave = generateSettings(
      selectedComponents,
      unusedComponents,
      isSettingsActive,
      name ?? settingsName,
    );
    let settingsMeta;

    try {
      if (!name && selectedProfileSettingsMeta) {
        settingsMeta = selectedProfileSettingsMeta;
        await saveProfileSettings(selectedProfile.id, settingsMeta.id, settingsToSave);
      } else {
        const response = await createProfileSettings(selectedProfile.id, settingsToSave);
        const created = (await response.json()) as ProfileSettingsMeta;
        settingsMeta = created;
      }
      setProfileSettings({ ...settingsToSave, missingFromSettings: [] });
      queryClient.refetchQueries({ queryKey: ['profileSettingsMeta', String(selectedProfile.id)] });
      queryClient.refetchQueries({ queryKey: ['profileSettings', String(selectedProfile.id), settingsMeta.id] });
      setSelectedProfileSettingsMeta(settingsMeta);
    } catch (error) {
      logger.error('Failed to set profile settings:', error);
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.error.saveProfileSettings'));
    }
  };

  const saveSettings = async (name?: string) => {
    try {
      setIsLoading(true);
      await saveAndSetPreferred();
      await saveAndSetSettings(name);
      setIsModified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveSettings,
  };
};
