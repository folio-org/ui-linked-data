import { FC, useMemo, createContext, useContext } from 'react';
import { useSearchState } from '@/store';
import type { SearchContextValue, SearchProviderProps } from '../types/provider.types';
import { getActiveConfig, getAvailableSources } from '../utils';
import { useSearchControlsHandlers, useSearchQuery, useUrlSync } from '../hooks';

export const SearchContext = createContext<SearchContextValue | null>(null);

export const SearchProvider: FC<SearchProviderProps> = ({
  config,
  uiConfig,
  flow,
  mode = 'custom',
  initialSegment,
  children,
}) => {
  // Determine if config has segments
  const hasSegments = !!config.segments && Object.keys(config.segments).length > 0;

  const { navigationState } = useSearchState(['navigationState']);
  const currentSegment = hasSegments
    ? ((navigationState as Record<string, unknown>)?.['segment'] as string | undefined) ||
      initialSegment ||
      config.defaults?.segment
    : undefined;
  const activeUIConfig = useMemo(() => getActiveConfig(uiConfig, currentSegment), [uiConfig, currentSegment]);
  const availableSources = useMemo(() => getAvailableSources(config, currentSegment), [config, currentSegment]);
  const handlers = useSearchControlsHandlers({ config, flow });

  // Sync URL to store (URL flow only, no-op for value flow)
  useUrlSync({ flow, config });

  // Search query - uses committed params based on flow
  const {
    data: results,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchQuery({
    coreConfig: config,
    flow,
    defaultSegment: config.defaults?.segment,
    hasSegments,
  });

  const contextValue = useMemo(
    (): SearchContextValue => ({
      // Configuration
      config,
      uiConfig,
      flow,
      mode,

      // Computed values
      activeUIConfig,
      availableSources,

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
      config,
      uiConfig,
      flow,
      mode,
      activeUIConfig,
      availableSources,
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
