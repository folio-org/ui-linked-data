import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import type { SearchFlow } from '../types/provider.types';

export interface CommittedSearchParams {
  segment?: string;
  query: string;
  searchBy: string;
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
      return {
        segment: hasSegments ? (searchParams.get('segment') ?? defaultSegment) : undefined,
        query: searchParams.get('query') ?? '',
        searchBy: searchParams.get('searchBy') ?? DEFAULT_SEARCH_BY,
        source: searchParams.get('source') ?? undefined,
        offset: Number.parseInt(searchParams.get('offset') ?? '0', 10),
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
