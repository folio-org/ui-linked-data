import { useMemo } from 'react';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';
import { useSearchContext } from '../providers/SearchProvider';
import { useCommittedSearchParams } from './useCommittedSearchParams';

/**
 * Hook to get formatted search results using the active config's resultFormatter
 * Handles slicing when API returns more items than UI page size
 */
export function useFormattedResults<T = unknown>(): T[] | undefined {
  const { results, config, flow } = useSearchContext();
  const committed = useCommittedSearchParams({ flow });

  const formattedData = useMemo(() => {
    if (!results?.items || !config?.strategies?.resultFormatter) {
      return undefined;
    }

    try {
      const allFormattedItems = config.strategies.resultFormatter.format(results.items) as T[];

      // If API returns more items than UI page size, slice to current page
      const apiLimit = config.defaults?.limit || 100;
      const uiPageSize = config.defaults?.uiPageSize || SEARCH_RESULTS_LIMIT;

      if (apiLimit > uiPageSize) {
        // Calculate which slice of items to show based on offset
        const currentOffset = committed.offset || 0;
        const indexInBatch = currentOffset % apiLimit;
        const start = indexInBatch;
        const end = start + uiPageSize;

        return allFormattedItems.slice(start, end);
      }

      return allFormattedItems;
    } catch (error) {
      console.error('Error formatting search results:', error);

      return undefined;
    }
  }, [results?.items, config, committed.offset, flow]);

  return formattedData;
}
