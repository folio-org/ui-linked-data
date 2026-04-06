import { useQueryClient } from '@tanstack/react-query';

import { fetchProfile } from '@/common/api/profiles.api';

export const PROFILE_QUERY_KEY = 'profile';
const STALE_TIME = 12 * 60 * 60 * 1000; // 12 hours

export const useLoadProfile = () => {
  const queryClient = useQueryClient();

  const loadProfile = (profileId: string | number) => {
    return queryClient.ensureQueryData({
      queryKey: [PROFILE_QUERY_KEY, String(profileId)],
      queryFn: () => fetchProfile(profileId),
      staleTime: STALE_TIME,
    });
  };

  return {
    loadProfile,
  };
};
