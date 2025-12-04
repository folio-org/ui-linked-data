import { FC, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import { SearchParam, getSearchConfig } from '../../core';
import type { SearchContextValue, SearchProviderProps } from '../types/provider.types';
import { resolveUIConfig } from '../config';
import { useSearchControlsHandlers, useSearchQuery, useUrlSync } from '../hooks';

export const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * Helper to check if props are for dynamic mode (segments provided)
 */
function isDynamicMode(props: SearchProviderProps): props is SearchProviderProps & { segments: string[] } {
  return 'segments' in props && Array.isArray(props.segments);
}

export const SearchProvider: FC<SearchProviderProps> = props => {
  const { flow, mode = 'custom', children } = props;
  const [searchParams] = useSearchParams();
  const { navigationState, setNavigationState } = useSearchState(['navigationState', 'setNavigationState']);
  const isInitialized = useRef(false);

  // Determine the current segment from URL (for URL flow) or navigation state
  const getCurrentSegment = (): string | undefined => {
    if (flow === 'url') {
      return searchParams.get(SearchParam.SEGMENT) ?? undefined;
    }

    return (navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string | undefined;
  };

  // Determine the current source from URL (for URL flow) or navigation state
  const getCurrentSource = (): string | undefined => {
    if (flow === 'url') {
      return searchParams.get(SearchParam.SOURCE) ?? undefined;
    }

    return (navigationState as Record<string, unknown>)?.[SearchParam.SOURCE] as string | undefined;
  };

  // Get the default segment based on mode
  const getDefaultSegment = (): string => {
    if (isDynamicMode(props)) {
      return props.defaultSegment ?? props.segments[0];
    }

    return props.config.id;
  };

  // Get the default source based on mode
  const getDefaultSource = (): string | undefined => {
    if (isDynamicMode(props)) {
      return props.defaultSource;
    }

    return undefined;
  };

  // Initialize segment/source on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const currentSegment = getCurrentSegment();

    // If we already have segment from URL or state, don't override
    if (currentSegment) return;

    const defaultSegment = getDefaultSegment();
    const defaultSource = getDefaultSource();

    // For URL flow, let the URL be the source of truth
    // Only initialize state for value flow
    if (flow === 'value') {
      const initialState: Record<string, unknown> = {};

      if (defaultSegment) {
        initialState[SearchParam.SEGMENT] = defaultSegment;
      }

      if (defaultSource) {
        initialState[SearchParam.SOURCE] = defaultSource;
      }

      setNavigationState(initialState as SearchParamsState);
    }
  }, []); // Run only on mount

  // Resolve current segment (from URL/state or default)
  const currentSegment = useMemo(() => {
    const fromState = getCurrentSegment();

    if (fromState) return fromState;

    return getDefaultSegment();
  }, [searchParams, navigationState, props]);

  // Resolve current source
  const currentSource = useMemo(() => {
    return getCurrentSource();
  }, [searchParams, navigationState]);

  // Resolve active core config based on mode
  const activeCoreConfig = useMemo(() => {
    if (isDynamicMode(props)) {
      // Dynamic mode: resolve from registry
      // Try segment + source first, then just segment
      if (currentSource) {
        const withSource = getSearchConfig(`${currentSegment}:${currentSource}`);

        if (withSource) return withSource;
      }

      const config = getSearchConfig(currentSegment);

      if (config) return config;

      // Fallback to defaultSegment or first segment's config
      const fallbackSegment = props.defaultSegment ?? props.segments[0];
      const fallbackConfig = getSearchConfig(fallbackSegment);

      if (!fallbackConfig) {
        throw new Error(`No config found for segment: ${fallbackSegment}`);
      }

      return fallbackConfig;
    }

    // Static mode: use provided config
    return props.config;
  }, [props, currentSegment, currentSource]);

  // Resolve active UI config based on mode
  const activeUIConfig = useMemo(() => {
    if (isDynamicMode(props)) {
      // Dynamic mode: resolve from UI registry
      const uiConfig = resolveUIConfig(currentSegment);

      if (uiConfig) return uiConfig;

      // Fallback to defaultSegment or first segment's UI config
      const fallbackSegment = props.defaultSegment ?? props.segments[0];
      const fallbackConfig = resolveUIConfig(fallbackSegment);

      if (!fallbackConfig) {
        throw new Error(`No UI config found for segment: ${fallbackSegment}`);
      }

      return fallbackConfig;
    }

    // Static mode: use provided uiConfig
    return props.uiConfig;
  }, [props, currentSegment]);

  // Base UI config (without segment-specific overrides) for context
  const baseUIConfig = useMemo(() => {
    if (isDynamicMode(props)) {
      // For dynamic mode, resolve the parent UI config
      const parentSegment = currentSegment.includes(':') ? currentSegment.split(':')[0] : currentSegment;
      const uiConfig = resolveUIConfig(parentSegment);

      return uiConfig ?? activeUIConfig;
    }

    return props.uiConfig;
  }, [props, currentSegment, activeUIConfig]);

  const handlers = useSearchControlsHandlers({ config: activeCoreConfig, flow });

  // Sync URL to store (URL flow only, no-op for value flow)
  useUrlSync({ flow, config: activeCoreConfig });

  // Search query - resolves effective config from committed segment + source
  const {
    data: results,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchQuery({
    fallbackConfig: activeCoreConfig,
    flow,
  });

  const contextValue = useMemo(
    (): SearchContextValue => ({
      // Configuration
      config: activeCoreConfig,
      uiConfig: baseUIConfig,
      flow,
      mode,

      // Computed values
      activeUIConfig,

      // Search results
      results,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,

      // Handlers
      onSegmentChange: handlers.onSegmentChange,
      onSourceChange: handlers.onSourceChange,
      onPageChange: handlers.onPageChange,
      onSubmit: handlers.onSubmit,
      onReset: handlers.onReset,
    }),
    [
      activeCoreConfig,
      baseUIConfig,
      flow,
      mode,
      activeUIConfig,
      results,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
      handlers,
    ],
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export const useSearchContext = (): SearchContextValue => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }

  return context;
};
