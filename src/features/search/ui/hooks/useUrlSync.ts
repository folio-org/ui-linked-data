import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchIdentifiers } from '@/common/constants/search.constants';
import { extractSearchParamsFromUrl } from '@/common/helpers/navigationState.helper';

import { useSearchState } from '@/store';

import { SearchParam, type SearchTypeConfig, removeBackslashes } from '../../core';
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
  const { setQuery, setSearchBy, setNavigationState } = useSearchState([
    'setQuery',
    'setSearchBy',
    'setNavigationState',
  ]);

  // Use refs for query/searchBy to avoid subscribing to their changes.
  // Reactive subscriptions would cause SearchProvider to re-render on every keystroke,
  // even in value flow where useUrlSync is a complete no-op.
  const queryRef = useRef(useSearchState.getState().query);
  const searchByRef = useRef(useSearchState.getState().searchBy);

  useEffect(() => {
    const unsubscribe = useSearchState.subscribe(state => {
      queryRef.current = state.query;
      searchByRef.current = state.searchBy;
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Only sync for URL flow
    if (flow !== 'url') return;

    const queryFromUrl = searchParams.get(SearchParam.QUERY);
    const searchByFromUrl = searchParams.get(SearchParam.SEARCH_BY);

    // Determine if this is an advanced search (query present but no searchBy)
    // Advanced search queries should NOT be synced to the input field
    const isAdvancedSearch = queryFromUrl !== null && searchByFromUrl === null;

    // Only sync query to store if it's NOT an advanced search
    if (!isAdvancedSearch && queryFromUrl !== null && queryFromUrl !== queryRef.current) {
      const unescapedQuery = removeBackslashes(queryFromUrl);
      setQuery(unescapedQuery);
    }

    // Validate searchBy against current configs before syncing to store
    if (searchByFromUrl !== null) {
      const validSearchBy = getValidSearchBy(searchByFromUrl, uiConfig, coreConfig);

      if (validSearchBy !== searchByRef.current) {
        setSearchBy(validSearchBy as SearchIdentifiers);
      }
    }

    // Build complete navigation state from URL for preservation when navigating to edit pages
    // Use shared helper to extract all params and avoid duplication
    const updatedState = extractSearchParamsFromUrl(searchParams);

    setNavigationState(updatedState as SearchParamsState);

    // If URL has no query but store does, clear store (only for simple search)
    // Don't clear if it's transitioning from advanced search
    if (queryFromUrl === null && queryRef.current && searchByFromUrl !== null) {
      setQuery('');
    }
  }, [flow, searchParams, setQuery, setSearchBy, setNavigationState, coreConfig, uiConfig]);
};
