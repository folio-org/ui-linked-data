import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MAX_LIMIT } from '@/common/constants/api.constants';
import baseApi from '@/common/api/base.api';
import { useCommittedSearchParams } from './useCommittedSearchParams';
import { selectStrategies, resolveCoreConfig, type SearchTypeConfig } from '../../core';
import type { SearchFlow } from '../types/provider.types';
import { getValidSearchBy } from '../utils';

interface SearchResults {
  items: unknown[];
  totalRecords: number;
  pageMetadata?: {
    totalElements: number;
    totalPages: number;
  };
}

interface UseSearchQueryParams {
  /**
   * Fallback config when no effective config can be resolved.
   * The actual query uses the effective config resolved from committed segment + source.
   */
  fallbackConfig?: SearchTypeConfig;
  flow: SearchFlow;
  enabled?: boolean;
}

interface UseSearchQueryResult {
  data: SearchResults | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSearchQuery({ fallbackConfig, flow, enabled = true }: UseSearchQueryParams): UseSearchQueryResult {
  const committed = useCommittedSearchParams({ flow });

  // Resolve effective config based on committed segment + source
  // This ensures the correct strategies are used based on what was actually submitted
  const effectiveConfig = useMemo(() => {
    if (!committed.segment) {
      return fallbackConfig;
    }

    // For URL flow, always try to resolve from committed params first
    const resolved = resolveCoreConfig(committed.segment, committed.source);

    return resolved ?? fallbackConfig;
  }, [committed.segment, committed.source, fallbackConfig]);

  // Validate searchBy against the effective config's valid options
  // If the URL has an invalid searchBy for this segment, use the config's default
  const effectiveSearchBy = useMemo(() => {
    if (!effectiveConfig) {
      return committed.searchBy;
    }

    return getValidSearchBy(committed.searchBy, effectiveConfig);
  }, [committed.searchBy, effectiveConfig]);

  const queryKey = useMemo(
    () =>
      ['search', effectiveConfig?.id, committed.query, effectiveSearchBy, committed.offset].filter(
        value => value !== undefined && value !== '',
      ),
    [effectiveConfig?.id, committed.query, effectiveSearchBy, committed.offset],
  );

  const queryFn = useCallback(async (): Promise<SearchResults> => {
    if (!effectiveConfig) {
      throw new Error('No effective config resolved');
    }

    const strategies = selectStrategies(effectiveConfig);

    if (!strategies?.requestBuilder) {
      throw new Error(`No request builder for config: ${effectiveConfig.id}`);
    }

    const limit = effectiveConfig.defaults?.limit ?? MAX_LIMIT;
    const request = strategies.requestBuilder.build({
      query: committed.query,
      searchBy: effectiveSearchBy,
      limit,
      offset: committed.offset,
    });

    const data = await baseApi.getJson({
      url: request.url,
      urlParams: request.urlParams,
      sameOrigin: request.sameOrigin,
    });

    if (strategies.responseTransformer) {
      return strategies.responseTransformer.transform(data, limit) as unknown as SearchResults;
    }

    return data as unknown as SearchResults;
  }, [effectiveConfig, committed.query, effectiveSearchBy, committed.offset]);

  // Determine if query should be enabled
  const shouldEnable = enabled && !!committed.query && !!effectiveConfig;

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
