import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import { SearchIdentifiers } from '@/common/constants/search.constants';
import { SearchParam, type SearchTypeConfig } from '../../core';
import type { SearchFlow } from '../types/provider.types';
import type { SearchTypeUIConfig } from '../types/ui.types';
import { getValidSearchBy } from '../utils';

interface UseUrlSyncParams {
  flow: SearchFlow;
  coreConfig: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
}

export const useUrlSync = ({ flow, coreConfig, uiConfig }: UseUrlSyncParams): void => {
  const [searchParams] = useSearchParams();
  const { query, setQuery, searchBy, setSearchBy, navigationState, setNavigationState } = useSearchState([
    'query',
    'setQuery',
    'searchBy',
    'setSearchBy',
    'navigationState',
    'setNavigationState',
  ]);

  useEffect(() => {
    // Only sync for URL flow
    if (flow !== 'url') return;

    const queryFromUrl = searchParams.get(SearchParam.QUERY);
    const searchByFromUrl = searchParams.get(SearchParam.SEARCH_BY);
    const segmentFromUrl = searchParams.get(SearchParam.SEGMENT);
    const sourceFromUrl = searchParams.get(SearchParam.SOURCE);
    const navState = navigationState as Record<string, unknown>;
    const currentSegment = navState?.[SearchParam.SEGMENT];
    const currentSource = navState?.[SearchParam.SOURCE];

    // Determine if this is an advanced search (query present but no searchBy)
    // Advanced search queries should NOT be synced to the input field
    const isAdvancedSearch = queryFromUrl !== null && searchByFromUrl === null;

    // Only sync query to store if it's NOT an advanced search
    if (!isAdvancedSearch && queryFromUrl !== null && queryFromUrl !== query) {
      setQuery(queryFromUrl);
    }

    // Validate searchBy against current configs before syncing to store
    if (searchByFromUrl !== null) {
      const validSearchBy = getValidSearchBy(searchByFromUrl, uiConfig, coreConfig);

      if (validSearchBy !== searchBy) {
        setSearchBy(validSearchBy as SearchIdentifiers);
      }
    }

    if (segmentFromUrl !== null && segmentFromUrl !== currentSegment) {
      const updatedState = { ...navigationState } as Record<string, unknown>;
      updatedState[SearchParam.SEGMENT] = segmentFromUrl;

      setNavigationState(updatedState as SearchParamsState);
    }

    if (sourceFromUrl !== null && sourceFromUrl !== currentSource) {
      const updatedState = { ...navigationState } as Record<string, unknown>;
      updatedState[SearchParam.SOURCE] = sourceFromUrl;

      setNavigationState(updatedState as SearchParamsState);
    }

    // If URL has no query but store does, clear store (only for simple search)
    // Don't clear if it's transitioning from advanced search
    if (queryFromUrl === null && query && searchByFromUrl !== null) {
      setQuery('');
    }
  }, [flow, searchParams, setQuery, setSearchBy, navigationState, setNavigationState, coreConfig, uiConfig]);
};
