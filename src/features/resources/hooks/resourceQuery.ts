import { getRecord } from '../api/records.api';

export const RESOURCE_QUERY_KEY = 'resource';

export const resourceQueryOptions = (resourceId: string) => ({
  queryKey: [RESOURCE_QUERY_KEY, resourceId] as const,
  queryFn: ({ signal }: { signal: AbortSignal }) => getRecord({ recordId: resourceId, signal }),
  staleTime: Infinity,
  gcTime: 5 * 60 * 1000,
});
