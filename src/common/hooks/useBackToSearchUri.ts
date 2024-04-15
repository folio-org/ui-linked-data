import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchQueryParams, ROUTES } from '@common/constants/routes.constants';

export const useBackToSearchUri = () => {
  const location = useLocation();
  const [searchResultsUrl, setSearchResultsUrl] = useState(ROUTES.SEARCH.uri);
  const { SearchBy, Query } = SearchQueryParams;

  useEffect(() => {
    const { state } = location;
    const searchByState = state?.[SearchBy];
    const queryState = state?.[Query];
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

    setSearchResultsUrl(`${updatedUri}?${new URLSearchParams(params)}`);
  }, [location]);

  return searchResultsUrl;
};
