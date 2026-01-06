import { useMemo } from 'react';
import { useCheckLocalHubs } from './useCheckLocalHubs';

/**
 * Hook to enrich hub search results with local availability information
 */
export function useEnrichHubsWithLocalCheck(
  data: SearchResultsTableRow[] | undefined,
): SearchResultsTableRow[] | undefined {
  // Extract tokens from data
  const tokens = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(row => row.__meta?.id).filter(Boolean) as string[];
  }, [data]);

  // Check local availability using React Query
  const { localHubIds, isLoading } = useCheckLocalHubs(tokens);

  // Enrich data with isLocal flag
  const enrichedData = useMemo(() => {
    if (!data) return undefined;

    return data.map(row => {
      const isLocalValue = localHubIds.has(row.__meta?.id || '');

      return {
        ...row,
        __meta: {
          ...row.__meta,
          isLocal: isLocalValue,
          isCheckingLocal: isLoading,
        },
      } as SearchResultsTableRow;
    });
  }, [data, localHubIds, isLoading]);

  return enrichedData;
}
