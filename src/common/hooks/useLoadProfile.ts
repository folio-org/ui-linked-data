import { fetchProfile } from '@/common/api/profiles.api';

import { useProfileState } from '@/store';

export const useLoadProfile = () => {
  const { profiles, setProfiles } = useProfileState(['profiles', 'setProfiles']);

  const loadProfile = async (profileId: string | number) => {
    if (profiles[profileId]) {
      return profiles[profileId];
    }

    const profile = await fetchProfile(profileId);
    setProfiles(prev => ({ ...prev, [profileId]: profile }));

    return profile;
  };

  return {
    loadProfile,
  };
};
