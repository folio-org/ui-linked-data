import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchIdentifiers } from '@/common/constants/search.constants';

import { useSearchState } from '@/store';

import { SearchParam, type SearchTypeConfig, extractSearchParamsFromUrl, removeBackslashes } from '../../core';
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
  const { query, setQuery, searchBy, setSearchBy, setNavigationState } = useSearchState([
    'query',
    'setQuery',
    'searchBy',
    'setSearchBy',
    'setNavigationState',
  ]);

  useEffect(() => {
    // Only sync for URL flow
    if (flow !== 'url') return;

    const queryFromUrl = searchParams.get(SearchParam.QUERY);
    const searchByFromUrl = searchParams.get(SearchParam.SEARCH_BY);

    // Determine if this is an advanced search (query present but no searchBy)
    // Advanced search queries should NOT be synced to the input field
    const isAdvancedSearch = queryFromUrl !== null && searchByFromUrl === null;

    // Only sync query to store if it's NOT an advanced search
    if (!isAdvancedSearch && queryFromUrl !== null && queryFromUrl !== query) {
      const unescapedQuery = removeBackslashes(queryFromUrl);
      setQuery(unescapedQuery);
    }

    // Validate searchBy against current configs before syncing to store
    if (searchByFromUrl !== null) {
      const validSearchBy = getValidSearchBy(searchByFromUrl, uiConfig, coreConfig);

      if (validSearchBy !== searchBy) {
        setSearchBy(validSearchBy as SearchIdentifiers);
      }
    }

    // Build complete navigation state from URL for preservation when navigating to edit pages
    // Use shared helper to extract all params and avoid duplication
    const updatedState = extractSearchParamsFromUrl(searchParams);

    setNavigationState(updatedState as SearchParamsState);

    // If URL has no query but store does, clear store (only for simple search)
    // Don't clear if it's transitioning from advanced search
    if (queryFromUrl === null && query && searchByFromUrl !== null) {
      setQuery('');
    }
  }, [flow, searchParams, setQuery, setSearchBy, setNavigationState, coreConfig, uiConfig]);
};
