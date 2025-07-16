import { fetchProfiles, fetchPreferredProfiles } from '@common/api/profiles.api';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useProfileState, useStatusState, useUIState } from '@src/store';

export const useProfileSelection = () => {
  const { preferredProfiles, setPreferredProfiles, availableProfiles, setAvailableProfiles } = useProfileState();
  const { setIsLoading } = useLoadingState();
  const { setIsProfileSelectionModalOpen } = useUIState();
  const { addStatusMessagesItem } = useStatusState();

  const checkProfileAndProceed = async ({
    resourceTypeURL,
    callback,
  }: {
    resourceTypeURL: string;
    callback: (profileId: string) => void;
  }) => {
    try {
      setIsLoading(true);
      // Check if we have a preferred profile
      const preferredProfilesResult = preferredProfiles ?? (await fetchPreferredProfiles(resourceTypeURL));

      if (preferredProfilesResult.length === 0) {
        // No preferred profile, load profiles list and show modal
        if (!availableProfiles?.length) {
          const result = await fetchProfiles(resourceTypeURL);

          setAvailableProfiles(result);
        }

        setIsProfileSelectionModalOpen(true);
      } else {
        setPreferredProfiles(preferredProfilesResult);

        // Use the preferred profile
        const profile = preferredProfilesResult.find(profile => profile.resourceType === resourceTypeURL);

        if (profile) {
          callback(profile.id);
        } else {
          setIsProfileSelectionModalOpen(true);
        }
      }
    } catch {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingResource'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkProfileAndProceed,
  };
};
