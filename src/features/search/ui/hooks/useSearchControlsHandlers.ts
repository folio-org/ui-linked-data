import { useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import type { SearchTypeConfig } from '../../core/types';
import type { SearchFlow } from '../types/provider.types';

interface UseSearchControlsHandlersParams {
  config: SearchTypeConfig;
  flow: SearchFlow;
}

interface SearchControlsHandlers {
  onSegmentChange: (segment: string) => void;
  onSourceChange: (source: string) => void;
  onPageChange: (page: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const useSearchControlsHandlers = ({
  config,
  flow,
}: UseSearchControlsHandlersParams): SearchControlsHandlers => {
  const [, setSearchParams] = useSearchParams();

  // Store actions (stable)
  const { setNavigationState, resetQuery, resetSearchBy } = useSearchState([
    'setNavigationState',
    'resetQuery',
    'resetSearchBy',
  ]);

  // Use refs for config/flow to avoid recreating handlers
  const configRef = useRef(config);
  const flowRef = useRef(flow);

  useEffect(() => {
    configRef.current = config;
    flowRef.current = flow;
  }, [config, flow]);

  const handleSegmentChange = useCallback(
    (newSegment: string) => {
      const currentState = useSearchState.getState();
      const updatedState = { ...currentState.navigationState } as Record<string, unknown>;
      updatedState['segment'] = newSegment;
      setNavigationState(updatedState as SearchParamsState);

      // URL flow: sync to URL
      if (flowRef.current === 'url') {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);

          params.set('segment', newSegment);
          params.delete('offset'); // Reset pagination

          return params;
        });
      }
    },
    [setNavigationState, setSearchParams],
  );

  const handleSourceChange = useCallback(
    (newSource: string) => {
      const currentState = useSearchState.getState();
      const updatedState = { ...currentState.navigationState } as Record<string, unknown>;
      updatedState['source'] = newSource;
      setNavigationState(updatedState as SearchParamsState);

      // URL flow: sync to URL
      if (flowRef.current === 'url') {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);

          params.set('source', newSource);
          params.delete('offset'); // Reset pagination

          return params;
        });
      }
    },
    [setNavigationState, setSearchParams],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (flowRef.current === 'url') {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          const offset = newPage * (configRef.current.defaults?.limit || 100);

          if (offset > 0) {
            params.set('offset', offset.toString());
          } else {
            params.delete('offset');
          }

          return params;
        });
      }

      // TODO: implement value flow
    },
    [setSearchParams],
  );

  const handleSubmit = useCallback(() => {
    const state = useSearchState.getState();
    const { query, searchBy, navigationState } = state;

    if (flowRef.current === 'url') {
      const urlParams = new URLSearchParams();

      if (query) {
        urlParams.set('query', query);
      }

      if (searchBy) {
        urlParams.set('searchBy', searchBy);
      }

      const navState = navigationState as Record<string, unknown>;
      const segment = navState?.['segment'];
      const source = navState?.['source'];

      if (segment && typeof segment === 'string') {
        urlParams.set('segment', segment);
      }

      if (source && typeof source === 'string') {
        urlParams.set('source', source);
      }

      setSearchParams(urlParams);
    } else {
      // TODO: implement Value flow
      // Value flow: trigger search manually
      // React Query will pick up state changes
      // Or call a callback here?
    }
  }, [setSearchParams]);

  const handleReset = useCallback(() => {
    resetQuery();
    resetSearchBy();

    const defaultNav = {} as Record<string, unknown>;

    if (configRef.current.defaults?.segment) {
      defaultNav['segment'] = configRef.current.defaults.segment;
    }

    if (configRef.current.defaults?.source) {
      defaultNav['source'] = configRef.current.defaults.source;
    }

    setNavigationState(defaultNav as SearchParamsState);

    if (flowRef.current === 'url') {
      setSearchParams({});
    }
  }, [resetQuery, resetSearchBy, setNavigationState, setSearchParams]);

  return {
    onSegmentChange: handleSegmentChange,
    onSourceChange: handleSourceChange,
    onPageChange: handlePageChange,
    onSubmit: handleSubmit,
    onReset: handleReset,
  };
};
