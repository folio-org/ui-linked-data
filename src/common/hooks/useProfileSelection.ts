import { fetchPreferredProfiles } from '@common/api/profiles.api';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useProfileState, useStatusState, useUIState } from '@src/store';
import { useProfileList } from '@/features/manageProfileSettings/hooks/useProfileList';

export const useProfileSelection = () => {
  const { setPreferredProfiles } = useProfileState(['setPreferredProfiles']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { setIsProfileSelectionModalOpen, setProfileSelectionType } = useUIState([
    'setIsProfileSelectionModalOpen',
    'setProfileSelectionType',
  ]);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { loadAvailableProfiles } = useProfileList();

  // Loads preferred profiles if they haven't been loaded yet
  const getPreferredProfiles = async () => {
    return await fetchPreferredProfiles();
  };

  // Processes the case when a preferred profile exists
  const handlePreferredProfileCase = (
    profiles: ProfileDTO[],
    resourceTypeURL: string,
    callback: (profileId: string | number) => void,
  ): boolean => {
    if (profiles.length) {
      setPreferredProfiles(profiles);
    }

    const profile = profiles.find(profile => profile.resourceType === resourceTypeURL);

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
      const preferredProfilesResult = await getPreferredProfiles();

      if (preferredProfilesResult.length > 0) {
        const profileProcessed = handlePreferredProfileCase(preferredProfilesResult, resourceTypeURL, callback);

        // If no matching profile was found, show the modal
        if (!profileProcessed) {
          openModal({ action: 'set', resourceTypeURL });
        }

        return;
      }

      // No preferred profiles, load available profiles and show modal
      await loadAvailableProfiles(resourceTypeURL);
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

      const preferredProfilesResult = await getPreferredProfiles();

      if (preferredProfilesResult.length > 0) {
        setPreferredProfiles(preferredProfilesResult);
      }

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
