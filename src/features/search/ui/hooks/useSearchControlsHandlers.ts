import { useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type SegmentDraft, useSearchState } from '@/store';
import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import { SearchParam, type SearchTypeConfig, resolveCoreConfig } from '../../core';
import type { SearchFlow } from '../types';
import type { SearchTypeUIConfig } from '../types/ui.types';
import { getValidSearchBy } from '../utils';
import { resolveUIConfig } from '../config';

interface UseSearchControlsHandlersParams {
  coreConfig: SearchTypeConfig;
  flow: SearchFlow;
}

interface SearchControlsHandlers {
  onSegmentChange: (segment: string) => void;
  onSourceChange: (source: string) => void;
  onPageChange: (page: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

// Use `resolveCoreConfig` from core registry

export const useSearchControlsHandlers = ({
  coreConfig,
  flow,
}: UseSearchControlsHandlersParams): SearchControlsHandlers => {
  const [, setSearchParams] = useSearchParams();

  // Use refs for config/flow to avoid recreating handlers
  const coreConfigRef = useRef(coreConfig);
  const flowRef = useRef(flow);

  useEffect(() => {
    coreConfigRef.current = coreConfig;
    flowRef.current = flow;
  }, [coreConfig, flow]);

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

  // Helper to restore draft for a segment, with searchBy validation
  const restoreDraft = useCallback(
    (segment: string, segmentConfig?: SearchTypeConfig, segmentUIConfig?: SearchTypeUIConfig): SegmentDraft => {
      const state = useSearchState.getState();
      const draft = state.draftBySegment[segment];

      if (draft) {
        // If we have a saved draft, validate its searchBy against the new segment's configs
        const validSearchBy =
          segmentConfig && segmentUIConfig
            ? getValidSearchBy(draft.searchBy, segmentUIConfig, segmentConfig)
            : draft.searchBy;

        setQuery(draft.query);
        setSearchBy(validSearchBy);

        return { ...draft, searchBy: validSearchBy };
      }

      // No draft exists - use defaults from the segment's config
      const defaultSearchBy = segmentConfig?.defaults?.searchBy ?? DEFAULT_SEARCH_BY;

      setQuery('');
      setSearchBy(defaultSearchBy as SearchIdentifiers);

      return {
        query: '',
        searchBy: defaultSearchBy as SearchIdentifiers,
        source: undefined,
      };
    },
    [setQuery, setSearchBy],
  );

  const handleSegmentChange = useCallback(
    (newSegment: string) => {
      // Save current segment's draft before switching
      saveCurrentDraft();

      // Resolve configs for the new segment using centralized resolvers
      const newSegmentConfig = resolveCoreConfig(newSegment);
      const newSegmentUIConfig = resolveUIConfig(newSegment);

      // Get draft for target segment
      const existingDraft = useSearchState.getState().draftBySegment[newSegment];
      const hasPreservedQuery = !!existingDraft?.query;

      // Update navigation state
      const currentState = useSearchState.getState();
      const updatedState = { ...currentState.navigationState } as Record<string, unknown>;
      updatedState[SearchParam.SEGMENT] = newSegment;

      // Restore source from target draft if exists
      if (existingDraft?.source) {
        updatedState[SearchParam.SOURCE] = existingDraft.source;
      } else {
        delete updatedState[SearchParam.SOURCE];
      }

      setNavigationState(updatedState as SearchParamsState);

      // Restore draft values (query, searchBy) with validation
      const restoredDraft = restoreDraft(newSegment, newSegmentConfig, newSegmentUIConfig);

      // URL flow: update URL
      if (flowRef.current === 'url') {
        setSearchParams(() => {
          const params = new URLSearchParams();
          params.set(SearchParam.SEGMENT, newSegment);

          // If restored segment has query, include full search params (auto-search)
          if (hasPreservedQuery) {
            params.set(SearchParam.QUERY, restoredDraft.query);
            params.set(SearchParam.SEARCH_BY, restoredDraft.searchBy);

            if (restoredDraft.source) {
              params.set(SearchParam.SOURCE, restoredDraft.source);
            }
          }

          return params;
        });
      } else if (hasPreservedQuery) {
        // Value flow: commit if preserved query exists
        setCommittedValues({
          segment: newSegment,
          query: restoredDraft.query,
          searchBy: restoredDraft.searchBy,
          source: restoredDraft.source,
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
          const offset = newPage * (coreConfigRef.current.defaults?.limit || 100);

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

    // Resolve the effective configs for the current segment + source
    const effectiveCoreConfig = resolveCoreConfig(segment, source) ?? coreConfigRef.current;
    const effectiveUIConfig = resolveUIConfig(segment);

    // Validate searchBy against the effective configs
    const validSearchBy = effectiveUIConfig
      ? getValidSearchBy(searchBy, effectiveUIConfig, effectiveCoreConfig)
      : searchBy;

    // Save current draft on submit (with validated searchBy)
    if (segment) {
      setDraftBySegment({
        ...draftBySegment,
        [segment]: {
          query,
          searchBy: validSearchBy,
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

      // Only include searchBy if it exists (for simple search)
      // Advanced search has query but no searchBy
      if (validSearchBy && searchBy) {
        urlParams.set(SearchParam.SEARCH_BY, validSearchBy);
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
        searchBy: validSearchBy,
        source,
        offset: 0,
      });
    }
  }, [setDraftBySegment, setSearchParams, setCommittedValues]);

  const handleReset = useCallback(() => {
    const state = useSearchState.getState();
    const navState = state.navigationState as Record<string, unknown>;
    const currentSegment = navState?.[SearchParam.SEGMENT] as string | undefined;
    const currentSource = navState?.[SearchParam.SOURCE] as string | undefined;

    resetQuery();
    resetSearchBy();

    if (currentSegment) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [currentSegment]: _removed, ...rest } = state.draftBySegment;

      setDraftBySegment(rest);
    }

    // Reset navigation to defaults
    const defaultNav = {} as Record<string, unknown>;
    const defaultSegment = coreConfigRef.current.id;

    if (defaultSegment) {
      defaultNav[SearchParam.SEGMENT] = defaultSegment;
    }

    setNavigationState(defaultNav as SearchParamsState);

    if (flowRef.current === 'url') {
      setSearchParams(() => {
        const params = new URLSearchParams();

        // Preserve segment when clearing
        if (currentSegment) {
          params.set(SearchParam.SEGMENT, currentSegment);
        }

        // Preserve source when clearing
        if (currentSource) {
          params.set(SearchParam.SOURCE, currentSource);
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
