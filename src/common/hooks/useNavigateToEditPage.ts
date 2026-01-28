import { ROUTES, QueryParams, SearchQueryParams } from '@common/constants/routes.constants';
import { useSearchState } from '@src/store';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const { navigationState } = useSearchState(['navigationState']);
  const [searchParams] = useSearchParams();

  // Build navigation state from current URL if navigationState is incomplete
  const getNavigationState = () => {
    if (navigationState?.[SearchQueryParams.Query]) {
      return navigationState;
    }

    const state: Record<string, string> = {};

    const query = searchParams.get(SearchQueryParams.Query);
    const searchBy = searchParams.get(SearchQueryParams.SearchBy);
    const segment = searchParams.get(SearchQueryParams.Segment);
    const source = searchParams.get(SearchQueryParams.Source);
    const offset = searchParams.get(SearchQueryParams.Offset);

    if (query) {
      state[SearchQueryParams.Query] = query;
    }

    if (searchBy) {
      state[SearchQueryParams.SearchBy] = searchBy;
    }

    if (segment) {
      state[SearchQueryParams.Segment] = segment;
    }

    if (source) {
      state[SearchQueryParams.Source] = source;
    }

    if (offset) {
      state[SearchQueryParams.Offset] = offset;
    }

    return state;
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
