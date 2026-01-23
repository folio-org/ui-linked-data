import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useStatusState, useUIState } from '@src/store';
import { useProfileList } from '@/features/manageProfileSettings/hooks/useProfileList';
import { usePreferredProfiles } from '@/features/manageProfileSettings/hooks/usePreferredProfiles';

export const useProfileSelection = () => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { setIsProfileSelectionModalOpen, setProfileSelectionType } = useUIState([
    'setIsProfileSelectionModalOpen',
    'setProfileSelectionType',
  ]);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { loadAvailableProfiles } = useProfileList();
  const { loadPreferredProfiles, preferredProfileForType } = usePreferredProfiles();

  // Processes the case when a preferred profile exists
  const handlePreferredProfileCase = (
    profiles: ProfileDTO[],
    resourceTypeURL: string,
    callback: (profileId: string | number) => void,
  ): boolean => {
    const profile = preferredProfileForType(resourceTypeURL, profiles);

    if (profile) {
      callback(profile.id);

      return true;
    }

    return false;
  };

  const openModal = ({
    action,
    resourceTypeURL,
  }: {
    action: ProfileSelectionActionType;
    resourceTypeURL: ResourceTypeURL;
  }) => {
    setIsProfileSelectionModalOpen(true);
    setProfileSelectionType({
      action,
      resourceTypeURL,
    });
  };

  const checkProfileAndProceed = async ({
    resourceTypeURL,
    callback,
  }: {
    resourceTypeURL: ResourceTypeURL;
    callback: (profileId: string | number) => void;
  }) => {
    try {
      setIsLoading(true);

      // Get preferred profiles
      const preferredProfiles = await loadPreferredProfiles();

      if (preferredProfiles?.length) {
        const profileProcessed = handlePreferredProfileCase(preferredProfiles, resourceTypeURL, callback);

        // If no matching profile was found, show the modal
        if (!profileProcessed) {
          openModal({ action: 'set', resourceTypeURL });
        }

        return;
      }

      // No preferred profiles, load available profiles
      const loadedProfiles = await loadAvailableProfiles(resourceTypeURL);

      // Check if only one profile is available - auto-select it
      if (loadedProfiles?.length === 1) {
        callback(loadedProfiles[0].id);
        return;
      }

      // Multiple profiles available - show modal
      openModal({ action: 'set', resourceTypeURL });
    } catch (error) {
      console.error('Failed to check profile and proceed:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingProfiles'));
    } finally {
      setIsLoading(false);
    }
  };

  const openModalForProfileChange = async ({ resourceTypeURL }: { resourceTypeURL: ResourceTypeURL }) => {
    try {
      setIsLoading(true);

      await loadPreferredProfiles();

      await loadAvailableProfiles(resourceTypeURL);
      openModal({ action: 'change', resourceTypeURL });
    } catch (error) {
      console.error('Failed to load profiles and proceed:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingProfiles'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkProfileAndProceed,
    openModalForProfileChange,
  };
};
