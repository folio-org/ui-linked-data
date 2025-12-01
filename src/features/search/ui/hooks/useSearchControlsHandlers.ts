import { useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type SegmentDraft, useSearchState } from '@/store';
import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import { SearchParam, type SearchTypeConfig } from '../../core';
import type { SearchFlow } from '../types';

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

const DEFAULT_DRAFT: SegmentDraft = {
  query: '',
  searchBy: DEFAULT_SEARCH_BY as SearchIdentifiers,
  source: undefined,
};

export const useSearchControlsHandlers = ({
  config,
  flow,
}: UseSearchControlsHandlersParams): SearchControlsHandlers => {
  const [, setSearchParams] = useSearchParams();

  // Use refs for config/flow to avoid recreating handlers
  const configRef = useRef(config);
  const flowRef = useRef(flow);

  useEffect(() => {
    configRef.current = config;
    flowRef.current = flow;
  }, [config, flow]);

  const {
    setNavigationState,
    resetQuery,
    resetSearchBy,
    setQuery,
    setSearchBy,
    setDraftBySegment,
    setCommittedValues,
    resetCommittedValues,
  } = useSearchState([
    'setNavigationState',
    'resetQuery',
    'resetSearchBy',
    'setQuery',
    'setSearchBy',
    'setDraftBySegment',
    'setCommittedValues',
    'resetCommittedValues',
  ]);

  // Helper to save current segment's draft
  const saveCurrentDraft = useCallback(() => {
    const state = useSearchState.getState();
    const { query, searchBy, navigationState, draftBySegment } = state;
    const navState = navigationState as Record<string, unknown>;
    const currentSegment = navState?.[SearchParam.SEGMENT] as string | undefined;
    const currentSource = navState?.[SearchParam.SOURCE] as string | undefined;

    if (!currentSegment) return;

    setDraftBySegment({
      ...draftBySegment,
      [currentSegment]: {
        query,
        searchBy,
        source: currentSource,
      },
    });
  }, [setDraftBySegment]);

  // Helper to restore draft for a segment
  const restoreDraft = useCallback(
    (segment: string): SegmentDraft => {
      const state = useSearchState.getState();
      const draft = state.draftBySegment[segment] ?? DEFAULT_DRAFT;

      setQuery(draft.query);
      setSearchBy(draft.searchBy);

      return draft;
    },
    [setQuery, setSearchBy],
  );

  const handleSegmentChange = useCallback(
    (newSegment: string) => {
      // Save current segment's draft before switching
      saveCurrentDraft();

      // Get draft for target segment
      const targetDraft = useSearchState.getState().draftBySegment[newSegment] ?? DEFAULT_DRAFT;
      const hasPreservedQuery = !!targetDraft.query;

      // Update navigation state
      const currentState = useSearchState.getState();
      const updatedState = { ...currentState.navigationState } as Record<string, unknown>;
      updatedState[SearchParam.SEGMENT] = newSegment;

      // Restore source from target draft if exists
      if (targetDraft.source) {
        updatedState[SearchParam.SOURCE] = targetDraft.source;
      } else {
        delete updatedState[SearchParam.SOURCE];
      }

      setNavigationState(updatedState as SearchParamsState);

      // Restore draft values (query, searchBy)
      restoreDraft(newSegment);

      // URL flow: update URL
      if (flowRef.current === 'url') {
        setSearchParams(() => {
          const params = new URLSearchParams();
          params.set(SearchParam.SEGMENT, newSegment);

          // If restored segment has query, include full search params (auto-search)
          if (hasPreservedQuery) {
            params.set(SearchParam.QUERY, targetDraft.query);
            params.set(SearchParam.SEARCH_BY, targetDraft.searchBy);

            if (targetDraft.source) {
              params.set(SearchParam.SOURCE, targetDraft.source);
            }
          }

          return params;
        });
      } else if (hasPreservedQuery) {
        // Value flow: commit if preserved query exists
        setCommittedValues({
          segment: newSegment,
          query: targetDraft.query,
          searchBy: targetDraft.searchBy,
          source: targetDraft.source,
          offset: 0,
        });
      }
    },
    [saveCurrentDraft, restoreDraft, setNavigationState, setSearchParams, setCommittedValues],
  );

  const handleSourceChange = useCallback(
    (newSource: string) => {
      const currentState = useSearchState.getState();
      const updatedState = { ...currentState.navigationState } as Record<string, unknown>;

      updatedState[SearchParam.SOURCE] = newSource;

      // Source is not immediately synced to URL - only on submit
      setNavigationState(updatedState as SearchParamsState);
    },
    [setNavigationState],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (flowRef.current === 'url') {
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          const offset = newPage * (configRef.current.defaults?.limit || 100);

          if (offset > 0) {
            params.set(SearchParam.OFFSET, offset.toString());
          } else {
            params.delete(SearchParam.OFFSET);
          }

          return params;
        });
      }

      // Value flow pagination: handled via setCommittedValues when implemented
    },
    [setSearchParams],
  );

  const handleSubmit = useCallback(() => {
    const state = useSearchState.getState();
    const { query, searchBy, navigationState, draftBySegment } = state;

    const navState = navigationState as Record<string, unknown>;
    const segment = (navState?.[SearchParam.SEGMENT] as string) ?? '';
    const source = navState?.[SearchParam.SOURCE] as string | undefined;

    // Save current draft on submit
    if (segment) {
      setDraftBySegment({
        ...draftBySegment,
        [segment]: {
          query,
          searchBy,
          source,
        },
      });
    }

    if (flowRef.current === 'url') {
      // URL flow: URL becomes the "committed" state
      const urlParams = new URLSearchParams();

      if (segment) {
        urlParams.set(SearchParam.SEGMENT, segment);
      }

      if (query) {
        urlParams.set(SearchParam.QUERY, query);
      }

      if (searchBy) {
        urlParams.set(SearchParam.SEARCH_BY, searchBy);
      }

      if (source) {
        urlParams.set(SearchParam.SOURCE, source);
      }

      setSearchParams(urlParams);
    } else {
      // Value flow: commit to store
      setCommittedValues({
        segment,
        query,
        searchBy,
        source,
        offset: 0,
      });
    }
  }, [setDraftBySegment, setSearchParams, setCommittedValues]);

  const handleReset = useCallback(() => {
    const state = useSearchState.getState();
    const navState = state.navigationState as Record<string, unknown>;
    const currentSegment = navState?.[SearchParam.SEGMENT] as string | undefined;

    resetQuery();
    resetSearchBy();

    if (currentSegment) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [currentSegment]: _removed, ...rest } = state.draftBySegment;

      setDraftBySegment(rest);
    }

    // Reset navigation to defaults
    const defaultNav = {} as Record<string, unknown>;

    if (configRef.current.defaults?.segment) {
      defaultNav[SearchParam.SEGMENT] = configRef.current.defaults.segment;
    }

    setNavigationState(defaultNav as SearchParamsState);

    if (flowRef.current === 'url') {
      setSearchParams(() => {
        const params = new URLSearchParams();

        if (configRef.current.defaults?.segment) {
          params.set(SearchParam.SEGMENT, configRef.current.defaults.segment);
        }

        return params;
      });
    } else {
      // Value flow: reset committed search
      resetCommittedValues();
    }
  }, [resetQuery, resetSearchBy, setDraftBySegment, setNavigationState, setSearchParams, setCommittedValues]);

  return {
    onSegmentChange: handleSegmentChange,
    onSourceChange: handleSourceChange,
    onPageChange: handlePageChange,
    onSubmit: handleSubmit,
    onReset: handleReset,
  };
};
