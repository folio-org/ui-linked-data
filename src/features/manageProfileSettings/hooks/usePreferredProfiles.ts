import { useProfileState } from '@/store';
import { fetchPreferredProfiles } from '@/common/api/profiles.api';

export const usePreferredProfiles = () => {
  const { preferredProfiles, setPreferredProfiles } = useProfileState(['preferredProfiles', 'setPreferredProfiles']);

  // Loads preferred profiles if they haven't been loaded yet
  const loadPreferredProfiles = async () => {
    if (!preferredProfiles) {
      const profiles = await fetchPreferredProfiles();
      setPreferredProfiles(profiles);
      return profiles;
    }
    return preferredProfiles;
  };

  const preferredProfileForType = (resourceTypeURL: string, profiles?: ProfileDTO[]) => {
    if (profiles) {
      return findProfileByType(resourceTypeURL, profiles);
    } else if (preferredProfiles) {
      return findProfileByType(resourceTypeURL, preferredProfiles);
    }
    return null;
  };

  const findProfileByType = (resourceTypeURL: string, profiles: ProfileDTO[]) => {
    return profiles.find(profile => profile.resourceType === resourceTypeURL);
  };

  return {
    loadPreferredProfiles,
    preferredProfileForType,
  };
};
