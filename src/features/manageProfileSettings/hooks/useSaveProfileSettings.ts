import { useQueryClient } from '@tanstack/react-query';

import { saveProfileSettings } from '@/common/api/profiles.api';
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
    unusedComponents,
    selectedComponents,
    setIsModified,
    setProfileSettings,
  } = useManageProfileSettingsState([
    'isSettingsActive',
    'isTypeDefaultProfile',
    'selectedProfile',
    'unusedComponents',
    'selectedComponents',
    'setIsModified',
    'setProfileSettings',
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
    const settingsToSave = generateSettings(selectedComponents, unusedComponents, isSettingsActive);

    try {
      await saveProfileSettings(selectedProfile.id, settingsToSave);
      setProfileSettings({ ...settingsToSave, missingFromSettings: [] });
      queryClient.refetchQueries({ queryKey: ['profileSettings', String(selectedProfile.id)] });
    } catch (error) {
      logger.error('Failed to set profile settings:', error);
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.error.saveProfileSettings'));
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
