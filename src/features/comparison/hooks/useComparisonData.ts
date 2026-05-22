import { useContext } from 'react';

import { useQueries } from '@tanstack/react-query';

import { SharedInfraContext } from '@/contexts';

import { useLoadProfile, useLoadProfileSettings } from '@/features/profiles';
import { fetchAndBuildPreview } from '@/features/resources';

export const useComparisonData = (resourceIds: string[]) => {
  const sharedInfra = useContext(SharedInfraContext);
  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();

  const results = useQueries({
    queries: resourceIds.map(id => ({
      queryKey: ['preview', 'comparison', id],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchAndBuildPreview({ resourceId: id, signal, sharedInfra, loadProfile, loadProfileSettings }),
      staleTime: 0,
      gcTime: 0,
    })),
  });

  return {
    items: results.map((result, index) => ({
      id: resourceIds[index],
      data: result.data ?? null,
      isLoading: result.isLoading || result.isFetching,
    })),
    isLoading: results.some(result => result.isLoading || result.isFetching),
  };
};
