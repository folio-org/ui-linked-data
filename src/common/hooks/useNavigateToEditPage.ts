import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

import { useLoadingState } from '@/store';

import { useNavigateWithSearchState } from './useNavigateWithSearchState';

/**
 * Hook for navigating to edit pages while preserving search state
 * This is a convenience wrapper around useNavigateWithSearchState
 */
export const useNavigateToEditPage = () => {
  const { navigateWithState } = useNavigateWithSearchState();
  const { setIsLoading } = useLoadingState(['setIsLoading']);

  const navigateToEditPage = (uri: string, options?: Parameters<typeof navigateWithState>[1]) => {
    setIsLoading(true);
    navigateWithState(uri, options);
  };

  const navigateAsDuplicate = (duplicateId: string) => {
    setIsLoading(true);
    navigateWithState(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`);
  };

  return {
    navigateToEditPage,
    navigateAsDuplicate,
  };
};
