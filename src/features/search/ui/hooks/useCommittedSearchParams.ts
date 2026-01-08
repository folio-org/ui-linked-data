import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import { SearchParam } from '../../core';
import type { SearchFlow } from '../types/provider.types';

export interface CommittedSearchParams {
  segment?: string;
  query: string;
  searchBy?: string; // undefined for advanced search (pre-formatted CQL query)
  source?: string;
  offset: number;
  selector?: 'query' | 'prev' | 'next'; // Browse pagination selector
}

interface UseCommittedSearchParamsParams {
  flow: SearchFlow;
}

export function useCommittedSearchParams({ flow }: UseCommittedSearchParamsParams): CommittedSearchParams {
  const [searchParams] = useSearchParams();
  const { committedValues } = useSearchState(['committedValues']);

  return useMemo(() => {
    if (flow === 'url') {
      // URL flow: URL is the committed state
      // Note: searchBy can be undefined for advanced search (pre-formatted CQL query)
      const urlSearchBy = searchParams.get(SearchParam.SEARCH_BY);

      return {
        segment: searchParams.get(SearchParam.SEGMENT) ?? undefined,
        query: searchParams.get(SearchParam.QUERY) ?? '',
        searchBy: urlSearchBy ?? undefined,
        source: searchParams.get(SearchParam.SOURCE) ?? undefined,
        offset: Number.parseInt(searchParams.get(SearchParam.OFFSET) ?? '0', 10),
      };
    }

    // Value flow: store committedValues is the committed state
    return {
      segment: committedValues.segment,
      query: committedValues.query,
      searchBy: committedValues.searchBy,
      source: committedValues.source,
      offset: committedValues.offset,
      selector: committedValues.selector,
    };
  }, [flow, searchParams, committedValues]);
}
