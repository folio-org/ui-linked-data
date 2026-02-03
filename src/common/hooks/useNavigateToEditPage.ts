import { useNavigate, useSearchParams } from 'react-router-dom';

import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

import { extractSearchParamsFromUrl } from '@/features/search/core/utils/search.helper';

import { useSearchState } from '@/store';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const { navigationState } = useSearchState(['navigationState']);
  const [searchParams] = useSearchParams();

  // Build navigation state from current URL if navigationState is empty
  const getNavigationState = () => {
    const hasNavigationState = navigationState && Object.keys(navigationState).length > 0;

    if (hasNavigationState) {
      return navigationState;
    }

    return extractSearchParamsFromUrl(searchParams);
  };

  const navigateAsDuplicate = (duplicateId: string) => {
    const state = getNavigationState();

    navigate(`${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.CloneOf}=${duplicateId}`, { state });
  };

  return {
    navigateToEditPage: (uri: string, { ...options } = {}) => {
      const state = getNavigationState();

      navigate(uri, { state: { ...state, isNavigatedFromLDE: true }, ...options });
    },
    navigateAsDuplicate,
  };
};
