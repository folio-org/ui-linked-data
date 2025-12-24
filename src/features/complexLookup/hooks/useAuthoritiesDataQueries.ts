import { useQuery } from '@tanstack/react-query';
import baseApi from '@/common/api/base.api';

const DEFAULT_SEARCH_FACETS_QUERY = 'id=*';

interface AuthoritiesDataQueriesConfig {
  sourceEndpoint?: string;
  facetsEndpoint?: string;
  facet?: string;
}

/**
 * Hook that encapsulates React Query data fetching for authorities source and facets.
 */
export function useAuthoritiesDataQueries({ sourceEndpoint, facetsEndpoint, facet }: AuthoritiesDataQueriesConfig) {
  const {
    data: sourceData,
    isLoading: isSourceLoading,
    refetch: refetchSource,
  } = useQuery({
    queryKey: ['authorities-source', sourceEndpoint],
    queryFn: async () => {
      if (!sourceEndpoint) {
        throw new Error('Source endpoint is required');
      }

      const data = await baseApi.getJson({
        url: sourceEndpoint,
        sameOrigin: true,
      });

      return data;
    },
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: facetsData,
    isLoading: isFacetsLoading,
    refetch: refetchFacets,
  } = useQuery({
    queryKey: ['authorities-facets', facetsEndpoint, facet],
    queryFn: async () => {
      if (!facetsEndpoint) {
        throw new Error('Facets endpoint is required');
      }

      const urlParams: Record<string, string> = { query: DEFAULT_SEARCH_FACETS_QUERY };

      if (facet) {
        urlParams.facet = facet;
      }

      const data = await baseApi.getJson({
        url: facetsEndpoint,
        urlParams,
        sameOrigin: true,
      });

      return data;
    },
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    sourceData,
    facetsData,
    isSourceLoading,
    isFacetsLoading,
    isLoading: isSourceLoading || isFacetsLoading,
    refetchSource,
    refetchFacets,
  };
}
