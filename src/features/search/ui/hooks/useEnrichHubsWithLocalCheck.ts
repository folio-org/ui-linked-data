import { useMemo } from 'react';
import { logger } from '@/common/services/logger';
import { useCheckLocalHubs } from './useCheckLocalHubs';
import { extractRowIds } from '../utils/tableFormatters.util';
import { enrichRowsWithLocalAvailability } from '../utils/hubEnrichment.util';

interface UseEnrichHubsWithLocalCheckReturn {
  enrichedData: SearchResultsTableRow[] | undefined;
  isError: boolean;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Hook to enrich hub search results with local availability information
 * Adds "isLocal" flag to each row's "__meta" object.
 */
export function useEnrichHubsWithLocalCheck(
  data: SearchResultsTableRow[] | undefined,
): UseEnrichHubsWithLocalCheckReturn {
  const tokens = useMemo(() => extractRowIds(data), [data]);
  const { localHubIds, isError, error, isLoading } = useCheckLocalHubs(tokens);

  // Enrich data with isLocal flag using utility
  const enrichedData = useMemo(() => {
    try {
      return enrichRowsWithLocalAvailability(data, localHubIds);
    } catch (err) {
      logger.error('Error enriching hub data with local availability:', err);
      return data;
    }
  }, [data, localHubIds]);

  return {
    enrichedData,
    isError,
    error,
    isLoading,
  };
}
