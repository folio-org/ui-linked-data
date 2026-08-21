import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchPreferredProfileSettings } from '@/common/api/profiles.api';

export const preferredProfileSettingsOptions = (profileId: string | number | null) =>
  queryOptions<ProfileSettingsMetaList>({
    queryKey: ['preferredProfileSettings', String(profileId)],
    queryFn: async () => {
      return fetchPreferredProfileSettings(profileId!);
    },
    staleTime: Infinity,
    enabled: !!profileId,
  });

export const usePreferredProfileSettings = (profileId: string | number | null) => {
  return useQuery<ProfileSettingsMetaList>(preferredProfileSettingsOptions(profileId));
};
