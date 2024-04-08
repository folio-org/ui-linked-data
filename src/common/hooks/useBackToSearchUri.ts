import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useBackToSearchUri = () => {
  const location = useLocation();
  const [searchResultsUrl, setSearchResultsUrl] = useState(ROUTES.SEARCH.uri);

  useEffect(() => {
    if (!location.state || !(location.state[QueryParams.SearchBy] && location.state[QueryParams.Query])) return;

    const updatedUri = ROUTES.SEARCH.uri;
    const params = {} as Record<string, string>;

    if (location.state[QueryParams.SearchBy]) {
      params[QueryParams.SearchBy] = location.state[QueryParams.SearchBy];
    }

    if (location.state[QueryParams.Query]) {
      params[QueryParams.Query] = location.state[QueryParams.Query];
    }

    setSearchResultsUrl(`${updatedUri}?${new URLSearchParams(params)}`);
  }, [location]);

  return searchResultsUrl;
};
