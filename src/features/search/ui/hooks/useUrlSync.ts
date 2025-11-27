import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import { SearchIdentifiers } from '@/common/constants/search.constants';
import type { SearchTypeConfig } from '../../core/types';
import type { SearchFlow } from '../types/provider.types';

interface UseUrlSyncParams {
  flow: SearchFlow;
  config: SearchTypeConfig;
}

export const useUrlSync = ({ flow, config }: UseUrlSyncParams): void => {
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

    const queryFromUrl = searchParams.get('query');
    const searchByFromUrl = searchParams.get('searchBy');
    const segmentFromUrl = searchParams.get('segment');
    const sourceFromUrl = searchParams.get('source');
    const navState = navigationState as Record<string, unknown>;
    const currentSegment = navState?.['segment'];
    const currentSource = navState?.['source'];

    if (queryFromUrl !== null && queryFromUrl !== query) {
      setQuery(queryFromUrl);
    }

    if (searchByFromUrl !== null && searchByFromUrl !== searchBy) {
      setSearchBy(searchByFromUrl as SearchIdentifiers);
    }

    if (segmentFromUrl !== null && segmentFromUrl !== currentSegment) {
      const updatedState = { ...navigationState } as Record<string, unknown>;
      updatedState['segment'] = segmentFromUrl;

      setNavigationState(updatedState as SearchParamsState);
    }

    if (sourceFromUrl !== null && sourceFromUrl !== currentSource) {
      const updatedState = { ...navigationState } as Record<string, unknown>;
      updatedState['source'] = sourceFromUrl;

      setNavigationState(updatedState as SearchParamsState);
    }

    // If URL has no query but store does, clear store
    if (queryFromUrl === null && query) {
      setQuery('');
    }
  }, [flow, searchParams, setQuery, setSearchBy, navigationState, setNavigationState, config]);
};
