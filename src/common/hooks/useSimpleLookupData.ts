import { useRecoilState } from 'recoil';
import { loadSimpleLookup } from '@common/helpers/api.helper';
import { alphabeticSortLabel } from '@common/helpers/common.helper';
import { formatLookupOptions } from '@common/helpers/formatLookupOptions.helper';
import state from '@state';

export const useSimpleLookupData = () => {
  const [lookupData, setLookupData] = useRecoilState(state.config.lookupData);

  const getLookupData = () => lookupData;

  const loadLookupData = async (uri: string) => {
    try {
      const response = await loadSimpleLookup(uri);

      if (!response) return null;

      const formattedLookupData = formatLookupOptions(response, uri)?.sort(alphabeticSortLabel);

      setLookupData(lookupData => ({ ...lookupData, [uri]: formattedLookupData }));

      return formattedLookupData;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(message);
    }
  };

  return { getLookupData, loadLookupData };
};
