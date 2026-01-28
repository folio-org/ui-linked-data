import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchQueryParams, ROUTES } from '@common/constants/routes.constants';

export const useBackToSearchUri = () => {
  const location = useLocation();
  const [searchResultsUrl, setSearchResultsUrl] = useState(ROUTES.SEARCH.uri);
  const { SearchBy, Query, Offset, Segment, Source } = SearchQueryParams;

  useEffect(() => {
    const { state } = location;
    const searchByState = state?.[SearchBy];
    const queryState = state?.[Query];
    const offsetState = state?.[Offset];
    const segmentState = state?.[Segment];
    const sourceState = state?.[Source];
    const updatedUri = ROUTES.SEARCH.uri;

    if (!state || !queryState) {
      // If no query but we have segment, still include it for direct navigation
      if (segmentState) {
        setSearchResultsUrl(`${updatedUri}?${Segment}=${segmentState}`);
      } else {
        setSearchResultsUrl(updatedUri);
      }

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

    if (segmentState) {
      params[Segment] = segmentState;
    }

    if (sourceState) {
      params[Source] = sourceState;
    }

    setSearchResultsUrl(`${updatedUri}?${new URLSearchParams(params)}`);
  }, [location]);

  return searchResultsUrl;
};
