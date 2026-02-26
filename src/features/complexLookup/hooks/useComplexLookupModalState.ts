import { useEffect } from 'react';

import { useSearchState } from '@/store';

interface UseComplexLookupModalStateParams {
  isOpen: boolean;
  assignedValue?: UserValueContents;
  defaultSegment: string;
  defaultSource?: string;
}

/**
 * Custom hook to manage search state lifecycle for complex lookup modals.
 * Resets all search state when modal opens and sets initial query from assignedValue if provided.
 * This ensures each modal starts with a clean state regardless of previous modal usage.
 */
export function useComplexLookupModalState({
  isOpen,
  assignedValue,
  defaultSegment,
  defaultSource,
}: UseComplexLookupModalStateParams) {
  const initialQuery = assignedValue?.label;
  // Extract assigned source from meta (if editing existing value with source)
  const assignedSource = assignedValue?.meta?.sourceType;
  // Use assigned source if exists, otherwise use config default
  const initialSource = assignedSource || defaultSource;
  const {
    setQuery,
    resetQuery,
    resetSearchBy,
    setNavigationState,
    setCommittedValues,
    setDraftBySegment,
    resetDraftBySegment,
    resetNavigationState,
    resetCommittedValues,
  } = useSearchState([
    'setQuery',
    'resetQuery',
    'resetSearchBy',
    'setNavigationState',
    'setCommittedValues',
    'setDraftBySegment',
    'resetDraftBySegment',
    'resetNavigationState',
    'resetCommittedValues',
  ]);

  useEffect(() => {
    if (isOpen) {
      setNavigationState({
        segment: defaultSegment,
        ...(initialSource ? { source: initialSource } : {}),
      });

      // Set committed values with initial query and source
      // This triggers useSearchQuery to auto-execute the search via its enabled flag
      setCommittedValues({
        segment: defaultSegment,
        query: initialQuery || '',
        searchBy: undefined,
        source: initialSource,
        offset: 0,
      });

      // Set draft query to populate the input field and save to segment draft
      if (initialQuery) {
        setQuery(initialQuery);

        // Save initial query to segment draft so it persists when switching segments
        setDraftBySegment({
          [defaultSegment]: {
            query: initialQuery,
            searchBy: undefined,
            source: initialSource,
          },
        });
      } else {
        // Clear drafts when no initial query
        resetDraftBySegment();
      }
    } else {
      // Clean up all search state when modal closes
      resetQuery();
      resetSearchBy();
      resetNavigationState();
      resetCommittedValues();
      resetDraftBySegment();
    }
  }, [isOpen, initialQuery, defaultSegment, initialSource]);
}
