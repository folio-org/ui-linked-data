import { FC, useMemo, createContext, useContext } from 'react';
import { useSearchState } from '@/store';
import type { SearchControlsContextValue, SearchControlsProviderProps } from '../types/provider.types';
import { useActiveConfig } from '../hooks/useActiveConfig';
import { useAvailableSources } from '../hooks/useAvailableSources';
import { useSearchControlsHandlers } from '../hooks/useSearchControlsHandlers';
import { useUrlSync } from '../hooks/useUrlSync';

export const SearchControlsContext = createContext<SearchControlsContextValue | null>(null);

export const SearchControlsProvider: FC<SearchControlsProviderProps> = ({
  config,
  uiConfig,
  flow,
  mode = 'custom',
  initialSegment,
  children,
}) => {
  const { navigationState } = useSearchState(['navigationState']);
  const currentSegment =
    ((navigationState as Record<string, unknown>)?.['segment'] as string | undefined) ||
    initialSegment ||
    config.defaults?.segment;
  const activeUIConfig = useActiveConfig(uiConfig, currentSegment);
  const availableSources = useAvailableSources(config, currentSegment);
  const handlers = useSearchControlsHandlers({ config, flow });

  // Sync URL to store (URL flow only, no-op for value flow)
  useUrlSync({ flow, config });

  const contextValue = useMemo(
    (): SearchControlsContextValue => ({
      // Configuration
      config,
      uiConfig,
      flow,
      mode,

      // Computed values
      activeUIConfig,
      availableSources,

      // Handlers
      onSegmentChange: handlers.onSegmentChange,
      onSourceChange: handlers.onSourceChange,
      onPageChange: handlers.onPageChange,
      onSubmit: handlers.onSubmit,
      onReset: handlers.onReset,
    }),
    [config, uiConfig, flow, mode, activeUIConfig, availableSources, handlers],
  );

  return <SearchControlsContext.Provider value={contextValue}>{children}</SearchControlsContext.Provider>;
};

export const useSearchControlsContext = (): SearchControlsContextValue => {
  const context = useContext(SearchControlsContext);

  if (!context) {
    throw new Error('useSearchControlsContext must be used within SearchControlsProvider');
  }

  return context;
};
