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
}

interface UseCommittedSearchParamsParams {
  flow: SearchFlow;
  defaultSegment?: string;
  hasSegments?: boolean;
}

export function useCommittedSearchParams({
  flow,
  defaultSegment,
  hasSegments = true,
}: UseCommittedSearchParamsParams): CommittedSearchParams {
  const [searchParams] = useSearchParams();
  const { committedValues } = useSearchState(['committedValues']);

  return useMemo(() => {
    if (flow === 'url') {
      // URL flow: URL is the committed state
      // Note: searchBy can be undefined for advanced search (pre-formatted CQL query)
      const urlSearchBy = searchParams.get(SearchParam.SEARCH_BY);

      return {
        segment: hasSegments ? (searchParams.get(SearchParam.SEGMENT) ?? defaultSegment) : undefined,
        query: searchParams.get(SearchParam.QUERY) ?? '',
        searchBy: urlSearchBy ?? undefined,
        source: searchParams.get(SearchParam.SOURCE) ?? undefined,
        offset: Number.parseInt(searchParams.get(SearchParam.OFFSET) ?? '0', 10),
      };
    }

    // Value flow: store committedValues is the committed state
    return {
      segment: hasSegments ? committedValues.segment || defaultSegment : undefined,
      query: committedValues.query,
      searchBy: committedValues.searchBy,
      source: committedValues.source,
      offset: committedValues.offset,
    };
  }, [flow, searchParams, defaultSegment, hasSegments, committedValues]);
}
