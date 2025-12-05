import { FC, useMemo, createContext, useContext } from 'react';
import type { SearchContextValue, SearchProviderProps } from '../types/provider.types';
import { useSearchControlsHandlers, useSearchQuery, useUrlSync, useSearchSegment, useSearchConfigs } from '../hooks';

export const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * Helper to check if props are for dynamic mode (segments provided)
 */
function isDynamicMode(props: SearchProviderProps): props is SearchProviderProps & { segments: string[] } {
  return 'segments' in props && Array.isArray(props.segments);
}

export const SearchProvider: FC<SearchProviderProps> = props => {
  const { flow, mode = 'custom', children } = props;

  // Extract dynamic/static mode params
  const dynamicParams = isDynamicMode(props)
    ? {
        segments: props.segments,
        defaultSegment: props.defaultSegment,
        defaultSource: props.defaultSource,
      }
    : {
        staticConfigId: props.config.id,
      };

  // Resolve current segment and source
  const { currentSegment, currentSource } = useSearchSegment({
    flow,
    ...dynamicParams,
  });

  // Resolve configs based on segment/source
  const { coreConfig, activeUIConfig, baseUIConfig } = useSearchConfigs({
    currentSegment,
    currentSource,
    segments: isDynamicMode(props) ? props.segments : undefined,
    defaultSegment: isDynamicMode(props) ? props.defaultSegment : undefined,
    staticConfig: isDynamicMode(props) ? undefined : props.config,
    staticUIConfig: isDynamicMode(props) ? undefined : props.uiConfig,
  });

  // Handlers for search controls
  const handlers = useSearchControlsHandlers({ coreConfig, flow });

  // Sync URL to store (URL flow only)
  useUrlSync({ flow, coreConfig, uiConfig: activeUIConfig });

  // Search query
  const {
    data: results,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchQuery({
    fallbackCoreConfig: coreConfig,
    fallbackUIConfig: activeUIConfig,
    flow,
  });

  const contextValue = useMemo(
    (): SearchContextValue => ({
      // Configuration
      config: coreConfig,
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
      coreConfig,
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
