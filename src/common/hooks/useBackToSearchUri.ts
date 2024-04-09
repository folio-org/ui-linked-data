import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';

export const useBackToSearchUri = () => {
  const location = useLocation();
  const [searchResultsUrl, setSearchResultsUrl] = useState(ROUTES.SEARCH.uri);
  const { SearchBy, Query } = QueryParams;

  useEffect(() => {
    const { state } = location;
    const searchByState = state?.[SearchBy];
    const queryState = state?.[Query];

    if (!state || !(searchByState && queryState)) return;

    const updatedUri = ROUTES.SEARCH.uri;
    const params = {} as Record<string, string>;

    params[SearchBy] = searchByState;
    params[Query] = queryState;

    setSearchResultsUrl(`${updatedUri}?${new URLSearchParams(params)}`);
  }, [location]);

  return searchResultsUrl;
};
