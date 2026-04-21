import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { buildNavigationState } from '@/common/helpers/navigationState.helper';

import { useSearchState } from '@/store';

/**
 * Generic hook for navigation that preserves search state
 * Use this when navigating to any page where you want to maintain search context
 */
export const useNavigateWithSearchState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationState } = useSearchState(['navigationState']);
  const [searchParams] = useSearchParams();

  const getNavigationState = () => {
    return buildNavigationState({
      storeNavigationState: navigationState,
      searchParams,
      location,
    });
  };

  const navigateWithState = (uri: string, { ...options } = {}) => {
    const state = getNavigationState();

    navigate(uri, { state: { ...state, isNavigatedFromLDE: true }, ...options });
  };

  return {
    navigateWithState,
    getNavigationState,
  };
};
