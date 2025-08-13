import { fetchProfiles, fetchPreferredProfiles } from '@common/api/profiles.api';
import { BibframeEntitiesMap } from '@common/constants/bibframe.constants';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useProfileState, useStatusState, useUIState } from '@src/store';

export const useProfileSelection = () => {
  const { preferredProfiles, setPreferredProfiles, availableProfiles, setAvailableProfiles } = useProfileState();
  const { setIsLoading } = useLoadingState();
  const { setIsProfileSelectionModalOpen, setProfileSelectionType } = useUIState();
  const { addStatusMessagesItem } = useStatusState();

  // Loads available profiles if they haven't been loaded yet
  const loadAvailableProfiles = async (resourceTypeURL: string) => {
    if (!availableProfiles?.length) {
      try {
        const result = await fetchProfiles(resourceTypeURL);

        setAvailableProfiles(result);
      } catch (error) {
        console.error('Failed to load available profiles:', error);
        // Re-throw to be handled by 'checkProfileAndProceed'
        throw error;
      }
    }
  };

  // Loads preferred profiles if they haven't been loaded yet
  const getPreferredProfiles = async (resourceTypeURL: string) => {
    return preferredProfiles ?? (await fetchPreferredProfiles(resourceTypeURL));
  };

  // Processes the case when a preferred profile exists
  const handlePreferredProfileCase = (
    profiles: ProfileDTO[],
    resourceTypeURL: string,
    callback: (profileId: string) => void,
  ): boolean => {
    setPreferredProfiles(profiles);

    const profile = profiles.find(profile => profile.resourceType === resourceTypeURL);

    if (profile) {
      callback(profile.id);

      return true;
    }

    return false;
  };

  const openModal = ({ action, resourceType }: { action: ProfileSelectionActionType; resourceType: ResourceType }) => {
    setIsProfileSelectionModalOpen(true);
    setProfileSelectionType({
      action,
      resourceType,
    });
  };

  const checkProfileAndProceed = async ({
    resourceTypeURL,
    callback,
  }: {
    resourceTypeURL: ResourceTypeURL;
    callback: (profileId: string) => void;
  }) => {
    try {
      setIsLoading(true);

      // Get preferred profiles
      const preferredProfilesResult = await getPreferredProfiles(resourceTypeURL);

      if (preferredProfilesResult.length > 0) {
        const profileProcessed = handlePreferredProfileCase(preferredProfilesResult, resourceTypeURL, callback);

        // If no matching profile was found, show the modal
        if (!profileProcessed) {
          openModal({ action: 'set', resourceType: BibframeEntitiesMap[resourceTypeURL] });
        }

        return;
      }

      // No preferred profiles, load available profiles and show modal
      await loadAvailableProfiles(resourceTypeURL);
      openModal({ action: 'set', resourceType: BibframeEntitiesMap[resourceTypeURL] });
    } catch (error) {
      console.error('Failed to check profile and proceed:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingProfiles'));
    } finally {
      setIsLoading(false);
    }
  };

  const changeProfile = async ({ resourceTypeURL }: { resourceTypeURL: ResourceTypeURL }) => {
    try {
      setIsLoading(true);

      await loadAvailableProfiles(resourceTypeURL);
      openModal({ action: 'change', resourceType: BibframeEntitiesMap[resourceTypeURL] });
    } catch (error) {
      console.error('Failed to load profiles and proceed:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingProfiles'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkProfileAndProceed,
    changeProfile,
  };
};
