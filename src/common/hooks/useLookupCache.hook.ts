import { useRef } from 'react';

export const useLookupCacheService = () => {
  const lookupDataRef = useRef({} as Record<string, MultiselectOption[]>);

  return {
    save: (key: string, data: MultiselectOption[]) => {
      lookupDataRef.current = { ...lookupDataRef.current, [key]: data };
    },
    getAll: () => lookupDataRef.current,
    getById: (id: string) => lookupDataRef.current[id],
  } as ILookupCacheService;
};
