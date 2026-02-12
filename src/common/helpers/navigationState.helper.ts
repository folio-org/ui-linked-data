import { Location } from 'react-router-dom';

import { SearchQueryParams } from '@/common/constants/routes.constants';

export const extractSearchParamsFromUrl = (searchParams: URLSearchParams): Record<string, string> => {
  const state: Record<string, string> = {};

  const query = searchParams.get(SearchQueryParams.Query);
  const searchBy = searchParams.get(SearchQueryParams.SearchBy);
  const segment = searchParams.get(SearchQueryParams.Segment);
  const source = searchParams.get(SearchQueryParams.Source);
  const offset = searchParams.get(SearchQueryParams.Offset);

  if (query !== null) {
    state[SearchQueryParams.Query] = query;
  }

  if (searchBy !== null) {
    state[SearchQueryParams.SearchBy] = searchBy;
  }

  if (segment !== null) {
    state[SearchQueryParams.Segment] = segment;
  }

  if (source !== null) {
    state[SearchQueryParams.Source] = source;
  }

  if (offset !== null) {
    state[SearchQueryParams.Offset] = offset;
  }

  return state;
};

// Build navigation state from store, URL, or location state (in priority order)
export const buildNavigationState = ({
  storeNavigationState,
  searchParams,
  location,
}: {
  storeNavigationState?: SearchParamsState | null;
  searchParams: URLSearchParams;
  location: Location;
}): SearchParamsState => {
  const hasNavigationState = storeNavigationState && Object.keys(storeNavigationState).length > 0;

  if (hasNavigationState) {
    return storeNavigationState;
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
