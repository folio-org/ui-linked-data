import { useMemo } from 'react';

import { logger } from '@/common/services/logger';

import { useSearchContext } from '../providers/SearchProvider';

/**
 * Hook to get formatted search results using the active core config's resultFormatter.
 * Uses activeCoreConfig (based on committed source) to ensure results remain stable
 * when user toggles source selector without submitting a new search.
 */
export function useFormattedResults<T = unknown>(): T[] | undefined {
  const { results, activeCoreConfig, config } = useSearchContext();

  const formatterConfig = activeCoreConfig ?? config;

  const formattedData = useMemo(() => {
    if (!results?.items) {
      return undefined;
    }

    if (formatterConfig?.strategies?.resultFormatter) {
      try {
        return formatterConfig.strategies.resultFormatter.format(results.items) as T[];
      } catch (error) {
        logger.error('Error formatting search results:', error);
        return undefined;
      }
    }

    return undefined;
  }, [results?.items, formatterConfig?.strategies?.resultFormatter]);

  return formattedData;
}
