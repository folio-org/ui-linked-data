import { useRef } from 'react';
import { SetterOrUpdater } from 'recoil';
import { loadSimpleLookup } from '@common/helpers/api.helper';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@common/helpers/lookupOptions.helper';

export const useSimpleLookupData = (
  basicLookupData?: Record<string, MultiselectOption[]>,
  saveLookupData?: SetterOrUpdater<Record<string, MultiselectOption[]>>,
) => {
  const lookupDataRef = useRef(basicLookupData || {});

  const getLookupData = () => lookupDataRef.current;

  const loadLookupData = async (uri: string, propertyURI?: string) => {
    try {
      const response = await loadSimpleLookup(uri);

      if (!response) return null;

      const formattedLookupData = formatLookupOptions(response, uri);
      const filteredLookupData = filterLookupOptionsByMappedValue(formattedLookupData, propertyURI);
      const sortedLookupData = filteredLookupData?.sort(alphabeticSortLabel);
      const updatedLookupData = { ...lookupDataRef.current, [uri]: sortedLookupData };

      lookupDataRef.current = updatedLookupData;
      saveLookupData?.(updatedLookupData);

      return sortedLookupData;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(message);
    }
  };

  return { getLookupData, loadLookupData };
};
