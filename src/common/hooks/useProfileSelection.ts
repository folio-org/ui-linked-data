import { fetchProfiles, fetchPreferredProfiles } from '@common/api/profiles.api';
import { useLoadingState, useProfileState, useUIState } from '@src/store';

export const useProfileSelection = () => {
  const { preferredProfiles, setPreferredProfiles, profilesMetadata, setProfilesMetadata } = useProfileState();
  const { setIsLoading } = useLoadingState();
  const { setIsProfileSelectionModalOpen } = useUIState();

  const checkProfileAndProceed = async (resourceType: string, callback: (profileId: number) => void) => {
    try {
      setIsLoading(true);
      // Check if we have a preferred profile
      const preferredProfilesResult = !preferredProfiles
        ? await fetchPreferredProfiles(resourceType)
        : preferredProfiles;

      if (preferredProfilesResult.length === 0) {
        // No preferred profile, load profiles list and show modal
        if (!profilesMetadata?.length) {
          const availableProfiles = await fetchProfiles(resourceType);

          setProfilesMetadata(availableProfiles);
        }

        setIsProfileSelectionModalOpen(true);
      } else {
        setPreferredProfiles(preferredProfilesResult);

        // Use the preferred profile
        const profile = preferredProfilesResult.find(profile => profile.resourceType === resourceType);

        if (profile) {
          callback(Number(profile.id));
        } else {
          setIsProfileSelectionModalOpen(true);
        }

        return true;
      }
    } catch (error) {
      // TODO: handle the error
      console.error('Error checking profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkProfileAndProceed,
  };
};
