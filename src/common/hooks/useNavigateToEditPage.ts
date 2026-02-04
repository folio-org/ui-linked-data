import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

import { extractSearchParamsFromUrl } from '@/features/search/core/utils/search.helper';

import { useSearchState } from '@/store';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationState } = useSearchState(['navigationState']);
  const [searchParams] = useSearchParams();

  // Build navigation state from store, URL, or location state (in priority order)
  const getNavigationState = () => {
    const hasNavigationState = navigationState && Object.keys(navigationState).length > 0;

    if (hasNavigationState) {
      return navigationState;
    }

    const urlState = extractSearchParamsFromUrl(searchParams);
    const hasUrlState = urlState && Object.keys(urlState).length > 0;

    if (hasUrlState) {
      return urlState;
    }

    // Fallback to location.state (preserves state when navigating between Edit pages)
    const locationState = location.state as (SearchParamsState & { isNavigatedFromLDE?: boolean }) | null;

    if (locationState && Object.keys(locationState).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isNavigatedFromLDE, ...searchState } = locationState;

      if (Object.keys(searchState).length > 0) {
        return searchState;
      }
    }

    return {};
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
