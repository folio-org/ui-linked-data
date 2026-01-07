import { useQuery } from '@tanstack/react-query';
import { hubLocalCheckService } from '../services';

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
    queryFn: () => hubLocalCheckService.checkLocalAvailability(tokens),
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
