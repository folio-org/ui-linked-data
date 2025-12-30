import { FC, useMemo, createContext, useContext } from 'react';
import type { SearchContextValue, SearchProviderProps } from '../types/provider.types';
import {
  useSearchControlsHandlers,
  useSearchQuery,
  useUrlSync,
  useSearchSegment,
  useValueFlowAutoSubmit,
} from '../hooks';
import { resolveSearchConfigs } from '../utils';

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
        staticCoreConfigId: props.coreConfig.id,
      };

  // Resolve current segment and source
  const { currentSegment, currentSource } = useSearchSegment({
    flow,
    ...dynamicParams,
  });

  // Resolve configs based on segment/source
  const { coreConfig, activeUIConfig, baseUIConfig } = useMemo(
    () =>
      resolveSearchConfigs({
        currentSegment,
        currentSource,
        segments: isDynamicMode(props) ? props.segments : undefined,
        defaultSegment: isDynamicMode(props) ? props.defaultSegment : undefined,
        staticCoreConfig: isDynamicMode(props) ? undefined : props.coreConfig,
        staticUIConfig: isDynamicMode(props) ? undefined : props.uiConfig,
      }),
    [currentSegment, currentSource, props],
  );

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

  // Handlers for search controls (after results so we can pass pageMetadata for browse pagination and refetch)
  const handlers = useSearchControlsHandlers({ coreConfig, uiConfig: activeUIConfig, flow, results, refetch });

  // Sync URL to store (URL flow only)
  useUrlSync({ flow, coreConfig, uiConfig: activeUIConfig });

  // Auto-submit for value flow when committedValues has query (similar to URL flow)
  useValueFlowAutoSubmit({ flow, onSubmit: handlers.onSubmit });

  const contextValue = useMemo(
    (): SearchContextValue => ({
      // Configuration
      config: coreConfig,
      uiConfig: baseUIConfig,
      flow,
      mode,

      // Computed values
      activeUIConfig,
      currentSegment,
      currentSource,

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
