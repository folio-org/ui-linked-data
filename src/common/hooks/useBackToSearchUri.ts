import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchQueryParams, ROUTES } from '@common/constants/routes.constants';

export const useBackToSearchUri = () => {
  const location = useLocation();
  const [searchResultsUrl, setSearchResultsUrl] = useState(ROUTES.SEARCH.uri);
  const { SearchBy, Query, Offset } = SearchQueryParams;

  useEffect(() => {
    const { state } = location;
    const searchByState = state?.[SearchBy];
    const queryState = state?.[Query];
    const offsetState = state?.[Offset];
    const updatedUri = ROUTES.SEARCH.uri;

    if (!state || !queryState) {
      setSearchResultsUrl(updatedUri);
      return;
    }

    const params = {
      [Query]: queryState,
    } as Record<string, string>;

    if (searchByState) {
      params[SearchBy] = searchByState;
    }

    if (offsetState) {
      params[Offset] = offsetState;
    }

    setSearchResultsUrl(`${updatedUri}?${new URLSearchParams(params)}`);
  }, [location]);

  return searchResultsUrl;
};
