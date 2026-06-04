import { useContext } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { generateLookupQueryOptions } from '@/common/queries/lookup.query';
import { SharedInfraContext } from '@/contexts';

import { useLoadProfile } from '@/features/profiles/hooks/useLoadProfile';
import { useLoadProfileSettings } from '@/features/profiles/hooks/useLoadProfileSettings';

import { fetchAndBuildPreview } from './fetchAndBuildPreview';

type PreviewContext = 'edit-link' | 'hub-lookup' | 'hub-search' | 'comparison' | 'search-preview';

export const useResourcePreviewQuery = (
  resourceId: string | undefined,
  ctx: PreviewContext,
  options?: { enabled?: boolean; idType?: ExternalResourceIdType },
) => {
  const sharedInfra = useContext(SharedInfraContext);
  const queryClient = useQueryClient();
  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();

  return useQuery({
    queryKey: ['preview', ctx, resourceId],
    queryFn: ({ signal }) => {
      if (!resourceId) return null;

      const loadLookup = (uri: string) => queryClient.ensureQueryData(generateLookupQueryOptions(uri));

      return fetchAndBuildPreview({
        resourceId,
        signal,
        sharedInfra,
        loadLookup,
        loadProfile,
        loadProfileSettings,
        idType: options?.idType,
      });
    },
    enabled: !!resourceId && (options?.enabled ?? true),
    staleTime: 0,
    gcTime: 0,
  });
};
