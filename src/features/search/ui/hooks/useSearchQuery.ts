import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchState } from '@/store';
import { useCommittedSearchParams } from './useCommittedSearchParams';
import { SearchParam, selectStrategies, type SearchTypeConfig } from '../../core';
import type { SearchFlow } from '../types/provider.types';

interface SearchRequest {
  url: string;
  options?: RequestInit;
}

interface SearchResults {
  items: unknown[];
  totalRecords: number;
  pageMetadata?: {
    totalElements: number;
    totalPages: number;
  };
}

interface UseSearchQueryParams {
  coreConfig?: SearchTypeConfig;
  flow: SearchFlow;
  defaultSegment?: string;
  hasSegments?: boolean;
  enabled?: boolean;
  fetchFn?: typeof fetch;
}

interface UseSearchQueryResult {
  data: SearchResults | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSearchQuery({
  coreConfig,
  flow,
  defaultSegment,
  hasSegments = true,
  enabled = true,
  fetchFn = fetch,
}: UseSearchQueryParams): UseSearchQueryResult {
  const committed = useCommittedSearchParams({ flow, defaultSegment, hasSegments });
  const { navigationState } = useSearchState(['navigationState']);
  const currentSegmentFromStore = hasSegments
    ? ((navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string)
    : undefined;

  const queryKey = useMemo(
    () =>
      ['search', committed.segment, committed.source, committed.query, committed.searchBy, committed.offset].filter(
        value => value !== undefined && value !== '',
      ),
    [committed],
  );

  const queryFn = useCallback(async (): Promise<SearchResults> => {
    if (!coreConfig) {
      throw new Error(`No core config for segment: ${committed.segment}`);
    }

    const strategies = selectStrategies(coreConfig, committed.segment, committed.source);

    if (!strategies?.requestBuilder) {
      throw new Error(`No request builder for segment: ${committed.segment}`);
    }

    // TODO: implement strategies
    const request = strategies.requestBuilder?.build({
      query: committed.query,
      searchBy: committed.searchBy,
      source: committed.source,
      limit: coreConfig.defaults?.limit ?? 100,
      offset: committed.offset,
    }) as SearchRequest;

    // TODO: use baseApi.getJson here
    const response = await fetchFn(request.url, request.options);

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // TODO: implement strategies
    if (strategies.responseTransformer) {
      return strategies.responseTransformer?.transform(data) as unknown as SearchResults;
    }

    return data as unknown as SearchResults;
  }, [coreConfig, committed]);

  // Determine if query should be enabled
  const segmentMatches = flow === 'url' || !hasSegments || committed.segment === currentSegmentFromStore;
  const shouldEnable = enabled && segmentMatches && !!committed.query && !!coreConfig;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<SearchResults>({
    queryKey,
    queryFn,
    enabled: shouldEnable,
  });

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
