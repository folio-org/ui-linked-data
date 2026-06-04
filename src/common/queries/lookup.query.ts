import { loadSimpleLookup } from '@/common/helpers/api.helper';
import { alphabeticSortLabel } from '@/common/helpers/common.helper';
import { formatLookupOptions } from '@/common/helpers/lookupOptions.helper';

export const generateLookupQueryOptions = (uri: string) => ({
  queryKey: ['lookup', uri] as const,
  queryFn: async (): Promise<MultiselectOption[]> => {
    const response = await loadSimpleLookup(uri);

    if (!response) return [];

    return formatLookupOptions(response, uri).toSorted(alphabeticSortLabel);
  },
  staleTime: Infinity,
  gcTime: 30 * 60 * 1000,
});
