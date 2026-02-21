import { useQueryClient } from '@tanstack/react-query';

import { deletePreferredProfile, savePreferredProfile, saveProfileSettings } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';
import { createUpdatedPreferredProfiles } from '@/common/helpers/profileActions.helper';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState } from '@/store';

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

  const saveAndUpdatePreferredProfiles = async () => {
    await savePreferredProfile(selectedProfile.id, selectedProfile.resourceType);
    const updatedPreferredProfiles = createUpdatedPreferredProfiles({
      profileId: selectedProfile.id,
      profileName: selectedProfile.name,
      resourceTypeURL: selectedProfile.resourceType,
      currentPreferredProfiles: preferredProfiles,
    });
    setPreferredProfiles(updatedPreferredProfiles);
  };

  const deleteAndUpdatePreferredProfiles = async () => {
    await deletePreferredProfile(selectedProfile.resourceType as ResourceTypeURL);
    const updatedPreferredProfiles = preferredProfiles.filter(profile => profile.id !== selectedProfile.id);
    setPreferredProfiles(updatedPreferredProfiles);
  };

  const determinePreferredAction = () => {
    const preferred = preferredProfiles.find(p => p.resourceType === selectedProfile.resourceType);

    if (preferred) {
      if (preferred.id === selectedProfile.id) {
        if (!isTypeDefaultProfile) {
          // This was the default profile for this resource type but is now not, so delete.
          return deleteAndUpdatePreferredProfiles;
        }
      } else {
        if (isTypeDefaultProfile) {
          // Another profile was the default for this resource type but this one now is, so save.
          return saveAndUpdatePreferredProfiles;
        }
      }
    } else {
      if (isTypeDefaultProfile) {
        // No default was set for this resource type, set it to this one now.
        return saveAndUpdatePreferredProfiles;
      }
    }

    // All other cases do not require action.
    return null;
  };

  const generateSettings = () => {
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

    return {
      active: isSettingsActive,
      children: settingsChildren,
    } as ProfileSettings;
  };

  const saveAndSetPreferred = async () => {
    const preferredAction = determinePreferredAction();

    if (preferredAction) {
      try {
        await preferredAction();
      } catch (error) {
        logger.error('Failed to set preferred profile:', error);
        addStatusMessagesItem?.(
          UserNotificationFactory.createMessage(StatusType.error, 'ld.error.profileSaveAsPreferred'),
        );
      }
    }
  };

  const saveAndSetSettings = async () => {
    const settingsToSave = generateSettings();

    try {
      await saveProfileSettings(selectedProfile.id, settingsToSave);
      setProfileSettings({ ...settingsToSave, missingFromSettings: [] });
      queryClient.invalidateQueries({ queryKey: ['profileSettings', selectedProfile.id] });
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
    } finally {
      setIsLoading(false);
    }

    setIsModified(false);
  };

  return {
    saveSettings,
  };
};
