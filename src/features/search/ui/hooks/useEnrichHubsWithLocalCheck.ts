import { useMemo } from 'react';
import { useCheckLocalHubs } from './useCheckLocalHubs';
import { extractRowIds } from '../utils/tableFormatters.util';
import { enrichRowsWithLocalAvailability } from '../utils/hubEnrichment.util';

/**
 * Hook to enrich hub search results with local availability information
 * Adds "isLocal" flag to each row's "__meta" object.
 */
export function useEnrichHubsWithLocalCheck(
  data: SearchResultsTableRow[] | undefined,
): SearchResultsTableRow[] | undefined {
  // Extract tokens from data using utility
  const tokens = useMemo(() => extractRowIds(data), [data]);

  // Check local availability using React Query
  const { localHubIds } = useCheckLocalHubs(tokens);

  // Enrich data with isLocal flag using utility
  const enrichedData = useMemo(() => enrichRowsWithLocalAvailability(data, localHubIds), [data, localHubIds]);

  return enrichedData;
}
