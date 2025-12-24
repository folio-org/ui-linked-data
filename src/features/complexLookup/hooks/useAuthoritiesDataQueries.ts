import { useQuery } from '@tanstack/react-query';
import baseApi from '@/common/api/base.api';

const DEFAULT_SEARCH_FACETS_QUERY = 'id=*';

interface AuthoritiesDataQueriesConfig {
  sourceEndpoint: string;
  facetsEndpoint: string;
  facet?: string;
}

/**
 * Hook that encapsulates React Query data fetching for authorities source and facets.
 */
export function useAuthoritiesDataQueries(config: AuthoritiesDataQueriesConfig) {
  const {
    data: sourceData,
    isLoading: isSourceLoading,
    refetch: refetchSource,
  } = useQuery({
    queryKey: ['authorities-source', config.sourceEndpoint],
    queryFn: async () => {
      const data = await baseApi.getJson({
        url: config.sourceEndpoint,
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
    queryKey: ['authorities-facets', config.facetsEndpoint, config.facet],
    queryFn: async () => {
      const urlParams: Record<string, string> = { query: DEFAULT_SEARCH_FACETS_QUERY };

      if (config.facet) {
        urlParams.facet = config.facet;
      }

      const data = await baseApi.getJson({
        url: config.facetsEndpoint,
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
