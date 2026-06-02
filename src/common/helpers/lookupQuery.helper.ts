import { alphabeticSortLabel } from '@/common/helpers/common.helper';
import { formatLookupOptions } from '@/common/helpers/lookupOptions.helper';

import { loadSimpleLookup } from './api.helper';

export const lookupQueryOptions = (uri: string) => ({
  queryKey: ['lookup', uri] as const,
  queryFn: async (): Promise<MultiselectOption[]> => {
    const response = await loadSimpleLookup(uri);

    if (!response) return [];

    return formatLookupOptions(response, uri).toSorted(alphabeticSortLabel);
  },
  staleTime: Infinity,
  gcTime: 30 * 60 * 1000,
});
