import { fetchProfile } from '@common/api/profiles.api';
import { useProfileState } from '@src/store';

export const useLoadProfile = () => {
  const { profiles, setProfiles } = useProfileState();

  const loadProfile = async (profileId: number) => {
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
