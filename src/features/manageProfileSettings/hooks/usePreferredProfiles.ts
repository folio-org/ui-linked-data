import { useProfileState } from '@/store';
import { fetchPreferredProfiles } from '@/common/api/profiles.api';

export const usePreferredProfiles = () => {
  const { preferredProfiles, setPreferredProfiles } = useProfileState(['preferredProfiles', 'setPreferredProfiles']);

  // Loads preferred profiles if they haven't been loaded yet
  const loadPreferredProfiles = async () => {
    if (!preferredProfiles) {
      setPreferredProfiles(await fetchPreferredProfiles());
    }
  };

  const preferredProfileForType = (resourceTypeURL: string) => {
    if (preferredProfiles) {
      return preferredProfiles.find(profile => profile.resourceType === resourceTypeURL);
    }
    return null;
  };

  return {
    loadPreferredProfiles,
    preferredProfileForType,
  };
};
