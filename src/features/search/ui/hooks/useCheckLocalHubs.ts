import { useQuery } from '@tanstack/react-query';
import baseApi from '@/common/api/base.api';
import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';

interface LocalHubCheckResponse {
  content?: Array<{
    id?: string;
    originalId?: string;
  }>;
}

interface UseCheckLocalHubsReturn {
  localHubIds: Set<string>;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook to check which hubs from external LoC search are available locally
 */
export function useCheckLocalHubs(tokens: string[]): UseCheckLocalHubsReturn {
  const sortedTokens = [...tokens].sort((a, b) => a.localeCompare(b));

  const { data, isError, error } = useQuery<Set<string>, Error>({
    queryKey: ['localHubs', sortedTokens],
    queryFn: async () => {
      if (!tokens || tokens.length === 0) {
        return new Set<string>();
      }

      const queryParts = tokens.map(token => `originalId="${token}"`);
      const query = queryParts.join(' or ');

      const response = (await baseApi.getJson({
        url: `${SEARCH_API_ENDPOINT.HUBS_LOCAL}?query=${encodeURIComponent(query)}`,
      })) as LocalHubCheckResponse;

      // Extract originalIds of locally available hubs
      const localIds = new Set<string>(
        (response.content || []).map(item => item.originalId).filter(Boolean) as string[],
      );

      return localIds;
    },
    enabled: tokens.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    localHubIds: data ?? new Set<string>(),
    isError,
    error,
  };
}
