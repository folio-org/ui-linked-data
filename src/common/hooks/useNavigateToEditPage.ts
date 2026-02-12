import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

import { useNavigateWithSearchState } from './useNavigateWithSearchState';

/**
 * Hook for navigating to edit pages while preserving search state
 * This is a convenience wrapper around useNavigateWithSearchState
 */
export const useNavigateToEditPage = () => {
  const { navigateWithState } = useNavigateWithSearchState();

  const navigateAsDuplicate = (duplicateId: string) => {
    navigateWithState(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`);
  };

  return {
    navigateToEditPage: navigateWithState,
    navigateAsDuplicate,
  };
};
