import { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import baseApi from '@/common/api/base.api';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';

import { type SearchTypeConfig, resolveCoreConfig } from '../../core';
import { resolveUIConfig } from '../config';
import type { SearchTypeUIConfig } from '../types';
import type { SearchFlow, SearchResults } from '../types/provider.types';
import { getValidSearchBy } from '../utils';
import { useCommittedSearchParams } from './useCommittedSearchParams';

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
      [
        'search',
        effectiveCoreConfig?.id,
        committed.query,
        effectiveSearchBy,
        committed.offset,
        committed.selector,
      ].filter(value => value !== undefined && value !== ''),
    [effectiveCoreConfig?.id, committed.query, effectiveSearchBy, committed.offset, committed.selector],
  );

  const queryFn = useCallback(async (): Promise<SearchResults | undefined> => {
    // Guard: Don't execute if query is empty or only whitespace
    if (!committed.query || committed.query.trim() === '') {
      return undefined;
    }

    if (!effectiveCoreConfig) {
      throw new Error('No effective config resolved');
    }

    const strategies = effectiveCoreConfig.strategies;

    if (!strategies?.requestBuilder) {
      throw new Error(`No request builder for config: ${effectiveCoreConfig.id}`);
    }

    const limit = (effectiveUIConfig?.limit || effectiveCoreConfig.defaults?.limit) ?? SEARCH_RESULTS_LIMIT;
    const request = strategies.requestBuilder.build({
      query: committed.query,
      searchBy: effectiveSearchBy,
      limit,
      offset: committed.offset,
      selector: committed.selector,
    });

    const data = await baseApi.getJson({
      url: request.url,
      urlParams: request.urlParams,
      sameOrigin: request.sameOrigin,
    });

    if (strategies.responseTransformer) {
      const normalized = strategies.responseTransformer.transform(data, limit);
      const totalPages = Math.ceil(normalized.totalRecords / limit);

      let items = normalized.content;

      if (strategies.resultEnricher) {
        items = await strategies.resultEnricher.enrich(items);
      }

      return {
        items,
        totalRecords: normalized.totalRecords,
        pageMetadata: {
          totalElements: normalized.totalRecords,
          totalPages,
          prev: normalized.prev, // Browse pagination anchor
          next: normalized.next, // Browse pagination anchor
        },
      };
    }

    return data as unknown as SearchResults;
  }, [
    effectiveCoreConfig,
    committed.query,
    effectiveSearchBy,
    committed.offset,
    committed.selector,
    effectiveUIConfig,
  ]);

  // Determine if query should be enabled
  // Only enable when we have a non-empty query string AND a valid config
  const shouldEnable = enabled && !!committed.query && committed.query.trim() !== '' && !!effectiveCoreConfig;

  // Main search query (includes enrichment if configured)
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: refetchQuery,
  } = useQuery<SearchResults | undefined>({
    queryKey,
    queryFn,
    enabled: shouldEnable,
  });

  // Unified refetch
  const refetch = useCallback(async () => {
    // Only refetch if we have a valid query
    if (committed.query && committed.query.trim() !== '') {
      await refetchQuery();
    }
  }, [refetchQuery, committed.query]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
