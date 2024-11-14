import { useContext } from 'react';
import { loadSimpleLookup } from '@common/helpers/api.helper';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@common/helpers/lookupOptions.helper';
import { ServicesContext } from '@src/contexts';

export const useSimpleLookupData = () => {
  const { lookupCacheService } = useContext(ServicesContext) as Required<ServicesParams>;

  const getLookupData = lookupCacheService.getAll;

  const loadLookupData = async (uri: string, propertyURI?: string) => {
    try {
      const response = await loadSimpleLookup(uri);

      if (!response) return null;

      const formattedLookupData = formatLookupOptions(response, uri);
      const filteredLookupData = filterLookupOptionsByMappedValue(formattedLookupData, propertyURI);
      const sortedLookupData = filteredLookupData?.toSorted(alphabeticSortLabel);

      lookupCacheService.save?.(uri, sortedLookupData);

      return sortedLookupData;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(message);
    }
  };

  return { getLookupData, loadLookupData };
};
