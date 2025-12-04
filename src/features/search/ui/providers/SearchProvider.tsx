import { FC, useMemo, createContext, useContext } from 'react';
import { useSearchState } from '@/store';
import { SearchParam, resolveCoreConfig } from '../../core';
import type { SearchContextValue, SearchProviderProps } from '../types/provider.types';
import { getActiveConfig } from '../utils';
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
  const { navigationState } = useSearchState(['navigationState']);
  const currentSegment =
    ((navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string | undefined) ||
    initialSegment ||
    config.id;

  const activeCoreConfig = useMemo(() => resolveCoreConfig(currentSegment) ?? config, [currentSegment, config]);
  const activeUIConfig = useMemo(() => getActiveConfig(uiConfig, currentSegment), [uiConfig, currentSegment]);
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
      uiConfig,
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
      uiConfig,
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
