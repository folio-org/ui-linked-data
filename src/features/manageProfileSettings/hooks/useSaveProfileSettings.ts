import { useQueryClient } from '@tanstack/react-query';

import { deletePreferredProfile, savePreferredProfile, saveProfileSettings } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';
import { createUpdatedPreferredProfiles } from '@/common/helpers/profileActions.helper';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState } from '@/store';

export const useSaveProfileSettings = () => {
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

  const { preferredProfiles, setPreferredProfiles } = useProfileState(['preferredProfiles', 'setPreferredProfiles']);

  const { setIsLoading } = useLoadingState(['setIsLoading']);

  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const queryClient = useQueryClient();

  const determinePreferredAction = () => {
    const preferred = preferredProfiles.find(p => p.resourceType === selectedProfile.resourceType);

    if (preferred) {
      if (preferred.id === selectedProfile.id) {
        if (!isTypeDefaultProfile) {
          // This was the default profile for this resource type but is now not, so delete.
          return () => deletePreferredProfile(selectedProfile.resourceType as ResourceTypeURL);
        }
      } else {
        if (isTypeDefaultProfile) {
          // Another profile was the default for this resource type but this one now is, so save.
          return () => savePreferredProfile(selectedProfile.id, selectedProfile.resourceType);
        }
      }
    } else {
      if (isTypeDefaultProfile) {
        // No default was set for this resource type, set it to this one now.
        return () => savePreferredProfile(selectedProfile.id, selectedProfile.resourceType);
      }
    }

    // All other cases do not require action.
    return null;
  };

  const saveSettings = async () => {
    const preferredAction = determinePreferredAction();

    const settingsChildren = [] as ProfileSettingsChildProperties[];
    selectedComponents.forEach((child, index) => {
      settingsChildren.push({
        id: child.id,
        visible: true,
        order: index + 1,
      });
    });
    unusedComponents.forEach((child, index) => {
      settingsChildren.push({
        id: child.id,
        visible: false,
        order: selectedComponents.length + index + 1,
      });
    });
    const settingsToSave = {
      active: isSettingsActive,
      children: settingsChildren,
    } as ProfileSettings;

    setIsLoading(true);

    try {
      if (preferredAction) {
        await preferredAction();
        const updatedPreferredProfiles = createUpdatedPreferredProfiles({
          profileId: selectedProfile.id,
          profileName: selectedProfile.name,
          resourceTypeURL: selectedProfile.resourceType,
          currentPreferredProfiles: preferredProfiles,
        });
        setPreferredProfiles(updatedPreferredProfiles);
      }
    } catch (error) {
      setIsLoading(false);
      logger.error('Failed to set preferred profile:', error);
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.error.profileSaveAsPreferred'),
      );
      return;
    }

    try {
      await saveProfileSettings(selectedProfile.id, settingsToSave);
      setProfileSettings({ ...settingsToSave, missingFromSettings: [] });
      setIsModified(false);
      queryClient.invalidateQueries({ queryKey: ['profileSettings', selectedProfile.id] });
    } catch (error) {
      logger.error('Failed to set profile settings:', error);
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.error.saveProfileSettings'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveSettings,
  };
};
