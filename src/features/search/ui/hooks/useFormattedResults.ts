import { useMemo } from 'react';
import { logger } from '@/common/services/logger';
import { useSearchContext } from '../providers/SearchProvider';
import { useCommittedSearchParams } from './useCommittedSearchParams';

/**
 * Hook to get formatted search results using the active config's resultFormatter
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

      return allFormattedItems;
    } catch (error) {
      logger.error('Error formatting search results:', error);

      return undefined;
    }
  }, [results?.items, config, committed.offset, flow]);

  return formattedData;
}
