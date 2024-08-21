import { useContext } from 'react';
import { loadSimpleLookup } from '@common/helpers/api.helper';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@common/helpers/lookupOptions.helper';
import { ServicesContext } from '@src/contexts';

export const useSimpleLookupData = () => {
  const { lookupCacheService: baseLookupCacheService } = useContext(ServicesContext);
  const lookupCacheService = baseLookupCacheService as ILookupCacheService;

  const getLookupData = lookupCacheService.getAll;

  const loadLookupData = async (uri: string, propertyURI?: string) => {
    try {
      const response = await loadSimpleLookup(uri);

      if (!response) return null;

      const formattedLookupData = formatLookupOptions(response, uri);
      const filteredLookupData = filterLookupOptionsByMappedValue(formattedLookupData, propertyURI);
      const sortedLookupData = filteredLookupData?.sort(alphabeticSortLabel);

      lookupCacheService.save?.(uri, sortedLookupData);

      return sortedLookupData;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(message);
    }
  };

  return { getLookupData, loadLookupData };
};
