import { useMemo } from 'react';
import { logger } from '@/common/services/logger';
import { useSearchContext } from '../providers/SearchProvider';

/**
 * Hook to get formatted search results using the active config's resultFormatter
 */
export function useFormattedResults<T = unknown>(): T[] | undefined {
  const { results, config } = useSearchContext();

  const formattedData = useMemo(() => {
    if (!results?.items) {
      return undefined;
    }

    if (config?.strategies?.resultFormatter) {
      try {
        return config.strategies.resultFormatter.format(results.items) as T[];
      } catch (error) {
        logger.error('Error formatting search results:', error);
        return undefined;
      }
    }

    return undefined;
  }, [results?.items, config?.strategies?.resultFormatter]);

  return formattedData;
}
