import { useRef } from 'react';
import { SetterOrUpdater } from 'recoil';
import { loadSimpleLookup } from '@common/helpers/api.helper';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { formatLookupOptions } from '@common/helpers/formatLookupOptions.helper';

export const useSimpleLookupData = (
  basicLookupData?: Record<string, MultiselectOption[]>,
  saveLookupData?: SetterOrUpdater<Record<string, MultiselectOption[]>>,
) => {
  const lookupDataRef = useRef(basicLookupData || {});

  const getLookupData = () => lookupDataRef.current;

  const loadLookupData = async (uri: string) => {
    try {
      const response = await loadSimpleLookup(uri);

      if (!response) return null;

      const formattedLookupData = formatLookupOptions(response, uri)?.sort(alphabeticSortLabel);
      const updatedLookupData = { ...lookupDataRef.current, [uri]: formattedLookupData };

      lookupDataRef.current = updatedLookupData;
      saveLookupData?.(updatedLookupData);

      return formattedLookupData;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(message);
    }
  };

  return { getLookupData, loadLookupData };
};
