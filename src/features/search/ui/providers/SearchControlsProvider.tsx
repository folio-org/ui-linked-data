import { FC, useMemo, useState, useCallback, createContext, type ReactElement, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SearchTypeConfig } from '../../core/types';
import type { SearchTypeUIConfig } from '../types';

/**
 * Flow types:
 * - 'url': Search driven by URL params (Search pages) - auto-executes on param changes
 * - 'value': Search driven by local state (Complex Lookup modals) - manual execution
 */
export type SearchFlow = 'url' | 'value';

/**
 * Rendering modes:
 * - 'auto': Context automatically renders all controls based on config
 * - 'custom': Client provides custom layout and uses individual compound components
 */
export type RenderMode = 'auto' | 'custom';

/**
 * Current search parameters built from URL or local state
 */
export interface CurrentSearchParams {
  query: string;
  searchBy: string;
  segment?: string;
  source?: string;
  offset: number;
  limit: number;
}

/**
 * Context value provided to all compound components
 */
export interface SearchControlsContextValue {
  // Configuration
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  flow: SearchFlow;
  mode: RenderMode;

  // Current state
  currentSegment?: string;
  currentSource?: string;
  currentPage: number;

  // Input state (local, uncommitted)
  query: string;
  searchBy: string;

  // Dynamic resolution
  activeUIConfig: SearchTypeUIConfig;
  availableSources?: Record<string, unknown>;

  // Handlers
  onQueryChange: (query: string) => void;
  onSearchByChange: (searchBy: string) => void;
  onSegmentChange: (segment: string) => void;
  onSourceChange: (source: string) => void;
  onPageChange: (page: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export interface SearchControlsProviderProps {
  // Required configs
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;

  // Flow and mode
  flow: SearchFlow;
  mode?: RenderMode;

  // Optional initial values (for value flow)
  initialQuery?: string;
  initialSearchBy?: string;
  initialSegment?: string;
  initialSource?: string;

  children: ReactElement<unknown>;
}

export const SearchControlsContext = createContext<SearchControlsContextValue | null>(null);

/**
 * SearchControlsProvider - Core orchestration layer
 *
 * Responsibilities:
 * - Manage search state (query, searchBy, segment, source, page)
 * - Handle flow differences (URL vs value)
 * - Resolve active UI config based on current segment
 * - Resolve available sources (segment-level or root-level)
 * - Provide handlers for all user interactions
 * - Coordinate state updates (no React Query yet)
 */
export const SearchControlsProvider: FC<SearchControlsProviderProps> = ({
  config,
  uiConfig,
  flow,
  mode = 'custom',
  initialQuery = '',
  initialSearchBy,
  initialSegment,
  initialSource,
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Local input state (uncommitted for value flow, mirrors URL for url flow)
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [localSearchBy, setLocalSearchBy] = useState(initialSearchBy || config.defaults?.searchBy || '');

  // Navigation state (segment/source selection)
  const [currentSegment, setCurrentSegment] = useState<string | undefined>(initialSegment || config.defaults?.segment);
  const [currentSource, setCurrentSource] = useState<string | undefined>(initialSource || config.defaults?.source);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);

  // Committed params (for value flow - what was actually submitted)
  const [committedParams, setCommittedParams] = useState<CurrentSearchParams | null>(null);

  // ============================================
  // DYNAMIC RESOLUTION
  // ============================================

  /**
   * Resolve active UI config based on current segment
   * If segment is active and has specific config, merge with base
   * Otherwise use base config
   */
  const activeUIConfig = useMemo((): SearchTypeUIConfig => {
    if (!currentSegment || !uiConfig.segments) {
      return uiConfig;
    }

    const segmentUIConfig = uiConfig.segments[currentSegment];
    if (!segmentUIConfig) {
      return uiConfig;
    }

    // Merge base + segment configs (segment overrides base)
    const base = uiConfig;
    return {
      ...base,
      ...segmentUIConfig,
      ui: {
        ...base.ui,
        ...segmentUIConfig.ui,
      },
      features: {
        ...base.features,
        ...segmentUIConfig.features,
      },
    };
  }, [uiConfig, currentSegment]);

  /**
   * Resolve available sources dynamically
   * Check segment-level sources first, fallback to root-level
   */
  const availableSources = useMemo(() => {
    // Check segment-level sources first
    if (currentSegment && config.segments?.[currentSegment]?.sources) {
      return config.segments[currentSegment].sources;
    }

    // Fallback to root-level sources
    return config.sources;
  }, [config, currentSegment]);

  /**
   * Build current search params based on flow
   * Note: Currently unused, will be used when integrating React Query
   */
  const buildCurrentParams = useCallback((): CurrentSearchParams => {
    if (flow === 'url') {
      // Read from URL
      return {
        query: searchParams.get('query') || '',
        searchBy: searchParams.get('searchBy') || config.defaults?.searchBy || '',
        segment: searchParams.get('segment') || currentSegment,
        source: searchParams.get('source') || currentSource,
        offset: currentPage * (config.defaults?.limit || 100),
        limit: config.defaults?.limit || 100,
      };
    }
    // Read from committed state (value flow)
    return (
      committedParams || {
        query: '',
        searchBy: config.defaults?.searchBy || '',
        segment: currentSegment,
        source: currentSource,
        offset: 0,
        limit: config.defaults?.limit || 100,
      }
    );
  }, [flow, searchParams, committedParams, currentSegment, currentSource, currentPage, config]);

  // Note: buildCurrentParams will be used when we integrate React Query
  // Keeping it here for the next iteration
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  buildCurrentParams;

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Query input change (local state, uncommitted)
   */
  const handleQueryChange = useCallback((newQuery: string) => {
    setLocalQuery(newQuery);
  }, []);

  /**
   * SearchBy dropdown change (local state, uncommitted)
   */
  const handleSearchByChange = useCallback((newSearchBy: string) => {
    setLocalSearchBy(newSearchBy);
  }, []);

  /**
   * Segment tab change
   * Resets page, updates URL/state immediately
   */
  const handleSegmentChange = useCallback(
    (newSegment: string) => {
      setCurrentSegment(newSegment);
      setCurrentPage(0); // Reset pagination

      if (flow === 'url') {
        // Update URL immediately
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          params.set('segment', newSegment);
          params.delete('offset'); // Reset offset
          return params;
        });
      }
      // For value flow, segment change doesn't trigger search automatically
    },
    [flow, setSearchParams],
  );

  /**
   * Source toggle change
   * Resets page, updates URL/state immediately
   */
  const handleSourceChange = useCallback(
    (newSource: string) => {
      setCurrentSource(newSource);
      setCurrentPage(0); // Reset pagination

      if (flow === 'url') {
        // Update URL immediately
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          params.set('source', newSource);
          params.delete('offset'); // Reset offset
          return params;
        });
      }
    },
    [flow, setSearchParams],
  );

  /**
   * Page change handler
   * Updates URL/state, triggers new search
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);

      if (flow === 'url') {
        // Update URL with new offset
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          const offset = newPage * (config.defaults?.limit || 100);
          if (offset > 0) {
            params.set('offset', offset.toString());
          } else {
            params.delete('offset');
          }
          return params;
        });
      }
      // For value flow, will need manual refetch (to be added with React Query)
    },
    [flow, setSearchParams, config],
  );

  /**
   * Submit handler - commits search
   */
  const handleSubmit = useCallback(() => {
    const params: CurrentSearchParams = {
      query: localQuery,
      searchBy: localSearchBy,
      segment: currentSegment,
      source: currentSource,
      offset: currentPage * (config.defaults?.limit || 100),
      limit: config.defaults?.limit || 100,
    };

    if (flow === 'url') {
      // Update URL (this will trigger search via useEffect watching searchParams)
      const urlParams = new URLSearchParams();
      if (params.query) urlParams.set('query', params.query);
      if (params.searchBy) urlParams.set('searchBy', params.searchBy);
      if (params.segment) urlParams.set('segment', params.segment);
      if (params.source) urlParams.set('source', params.source);
      if (params.offset > 0) urlParams.set('offset', params.offset.toString());

      setSearchParams(urlParams);
    } else {
      // Commit to local state (this will trigger search via useEffect watching committedParams)
      setCommittedParams(params);
      setCurrentPage(0); // Reset page on new search
    }
  }, [localQuery, localSearchBy, currentSegment, currentSource, currentPage, config, flow, setSearchParams]);

  /**
   * Reset handler - clears all inputs
   */
  const handleReset = useCallback(() => {
    setLocalQuery('');
    setLocalSearchBy(config.defaults?.searchBy || '');
    setCurrentSegment(config.defaults?.segment);
    setCurrentSource(config.defaults?.source);
    setCurrentPage(0);

    if (flow === 'url') {
      setSearchParams({});
    } else {
      setCommittedParams(null);
    }
  }, [config, flow, setSearchParams]);

  // ============================================
  // SYNC URL TO LOCAL STATE (URL FLOW ONLY)
  // ============================================

  // For URL flow, sync URL params to local input state
  // This ensures inputs reflect URL state (e.g., browser back/forward)
  useMemo(() => {
    if (flow === 'url') {
      const queryFromUrl = searchParams.get('query');
      const searchByFromUrl = searchParams.get('searchBy');
      const segmentFromUrl = searchParams.get('segment');
      const sourceFromUrl = searchParams.get('source');
      const offsetFromUrl = searchParams.get('offset');

      if (queryFromUrl !== null) setLocalQuery(queryFromUrl);
      if (searchByFromUrl !== null) setLocalSearchBy(searchByFromUrl);
      if (segmentFromUrl !== null) setCurrentSegment(segmentFromUrl);
      if (sourceFromUrl !== null) setCurrentSource(sourceFromUrl);
      if (offsetFromUrl !== null) {
        const offset = Number.parseInt(offsetFromUrl, 10);
        const page = Math.floor(offset / (config.defaults?.limit || 100));
        setCurrentPage(page);
      }
    }
  }, [flow, searchParams, config]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const contextValue: SearchControlsContextValue = useMemo(
    () => ({
      // Configuration
      config,
      uiConfig,
      flow,
      mode,

      // Current state
      currentSegment,
      currentSource,
      currentPage,

      // Input state
      query: localQuery,
      searchBy: localSearchBy,

      // Dynamic resolution
      activeUIConfig,
      availableSources,

      // Handlers
      onQueryChange: handleQueryChange,
      onSearchByChange: handleSearchByChange,
      onSegmentChange: handleSegmentChange,
      onSourceChange: handleSourceChange,
      onPageChange: handlePageChange,
      onSubmit: handleSubmit,
      onReset: handleReset,
    }),
    [
      config,
      uiConfig,
      flow,
      mode,
      currentSegment,
      currentSource,
      currentPage,
      localQuery,
      localSearchBy,
      activeUIConfig,
      availableSources,
      handleQueryChange,
      handleSearchByChange,
      handleSegmentChange,
      handleSourceChange,
      handlePageChange,
      handleSubmit,
      handleReset,
    ],
  );

  return <SearchControlsContext.Provider value={contextValue}>{children}</SearchControlsContext.Provider>;
};

/**
 * Hook to access SearchControlsContext
 * Throws error if used outside provider
 */
export const useSearchControlsContext = () => {
  const context = useContext(SearchControlsContext);

  if (!context) {
    throw new Error('useSearchControlsContext must be used within SearchControlsProvider');
  }

  return context;
};
