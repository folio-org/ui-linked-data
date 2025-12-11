import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MAX_LIMIT } from '@/common/constants/api.constants';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';
import baseApi from '@/common/api/base.api';
import { useCommittedSearchParams } from './useCommittedSearchParams';
import { resolveCoreConfig, type SearchTypeConfig } from '../../core';
import type { SearchFlow } from '../types/provider.types';
import type { SearchTypeUIConfig } from '../types';
import { getValidSearchBy } from '../utils';
import { resolveUIConfig } from '../config';

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
  fallbackCoreConfig?: SearchTypeConfig;
  fallbackUIConfig?: SearchTypeUIConfig;
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

export function useSearchQuery({
  fallbackCoreConfig,
  fallbackUIConfig,
  flow,
  enabled = true,
}: UseSearchQueryParams): UseSearchQueryResult {
  const committed = useCommittedSearchParams({ flow });

  // Resolve effective config based on committed segment + source
  // This ensures the correct strategies are used based on what was actually submitted
  const effectiveCoreConfig = useMemo(() => {
    if (!committed.segment) {
      return fallbackCoreConfig;
    }

    // For URL flow, always try to resolve from committed params first
    const resolved = resolveCoreConfig(committed.segment, committed.source);

    return resolved ?? fallbackCoreConfig;
  }, [committed.segment, committed.source, fallbackCoreConfig]);

  // Resolve effective UI config
  const effectiveUIConfig = useMemo(() => {
    if (!committed.segment) {
      return fallbackUIConfig;
    }

    const resolved = resolveUIConfig(committed.segment);

    return resolved ?? fallbackUIConfig;
  }, [committed.segment, fallbackUIConfig]);

  // Validate searchBy against the effective configs' valid options
  // If the URL has an invalid searchBy for this segment, use the config's default
  // For advanced search (query without searchBy), keep it undefined
  const effectiveSearchBy = useMemo(() => {
    // Advanced search: query exists but searchBy is undefined - keep it undefined
    if (committed.query && !committed.searchBy) {
      return undefined;
    }

    if (!effectiveCoreConfig || !effectiveUIConfig) {
      return committed.searchBy;
    }

    return getValidSearchBy(committed.searchBy, effectiveUIConfig, effectiveCoreConfig);
  }, [committed.query, committed.searchBy, effectiveCoreConfig, effectiveUIConfig]);

  const queryKey = useMemo(
    () =>
      ['search', effectiveCoreConfig?.id, committed.query, effectiveSearchBy, committed.offset].filter(
        value => value !== undefined && value !== '',
      ),
    [effectiveCoreConfig?.id, committed.query, effectiveSearchBy, committed.offset],
  );

  const queryFn = useCallback(async (): Promise<SearchResults> => {
    if (!effectiveCoreConfig) {
      throw new Error('No effective config resolved');
    }

    const strategies = effectiveCoreConfig.strategies;

    if (!strategies?.requestBuilder) {
      throw new Error(`No request builder for config: ${effectiveCoreConfig.id}`);
    }

    const limit = effectiveCoreConfig.defaults?.limit ?? MAX_LIMIT;
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
      const normalized = strategies.responseTransformer.transform(data, limit);

      // Use UI page size from config (10 for Resources, 100 for Hubs/Authorities)
      const uiPageSize = effectiveCoreConfig.defaults?.uiPageSize || SEARCH_RESULTS_LIMIT;
      const totalPages = Math.ceil(normalized.totalRecords / uiPageSize);

      return {
        items: normalized.content,
        totalRecords: normalized.totalRecords,
        pageMetadata: {
          totalElements: normalized.totalRecords,
          totalPages,
        },
      };
    }

    return data as unknown as SearchResults;
  }, [effectiveCoreConfig, committed.query, effectiveSearchBy, committed.offset]);

  // Determine if query should be enabled
  const shouldEnable = enabled && !!committed.query && !!effectiveCoreConfig;

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
