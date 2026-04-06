import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { logger } from '@/common/services/logger';

import { useSearchState } from '@/store';

import { ResultFormatterOptions } from '../../core/types';
import { useSearchContext } from '../providers/SearchProvider';

/**
 * Hook to get formatted search results using the active core config's resultFormatter.
 * Uses activeCoreConfig (based on committed source) to ensure results remain stable
 * when user toggles source selector without submitting a new search.
 */
export function useFormattedResults<T = unknown>(): T[] | undefined {
  const { results, activeCoreConfig, config, resultFormatterLabelIds } = useSearchContext();
  const { sourceData } = useSearchState(['sourceData']);
  const { formatMessage } = useIntl();

  const formatterConfig = activeCoreConfig ?? config;
  const localizedFormatterOptions = useMemo<ResultFormatterOptions | undefined>(() => {
    if (!resultFormatterLabelIds || Object.keys(resultFormatterLabelIds).length === 0) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(resultFormatterLabelIds).map(([optionKey, labelId]) => [
        optionKey,
        formatMessage({ id: labelId }),
      ]),
    );
  }, [resultFormatterLabelIds, formatMessage]);

  const formattedData = useMemo(() => {
    if (!results?.items) {
      return undefined;
    }

    if (formatterConfig?.strategies?.resultFormatter) {
      try {
        return formatterConfig.strategies.resultFormatter.format(
          results.items,
          sourceData,
          localizedFormatterOptions,
        ) as T[];
      } catch (error) {
        logger.error('Error formatting search results:', error);
        return undefined;
      }
    }

    return undefined;
  }, [results?.items, formatterConfig?.strategies?.resultFormatter, sourceData, localizedFormatterOptions]);

  return formattedData;
}
