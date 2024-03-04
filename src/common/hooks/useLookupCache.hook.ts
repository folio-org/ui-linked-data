import state from '@state';
import { useRecoilState } from 'recoil';

export const useLookupCacheService = () => {
  const [lookupData, setLookupData] = useRecoilState(state.config.lookupData);

  return {
    save: (key: string, data: MultiselectOption[]) => {
      const updatedData = { ...lookupData, [key]: data };

      setLookupData(updatedData);
    },
    getAll: () => lookupData,
    getById: (id: string) => lookupData[id],
  } as ILookupCacheService;
};
