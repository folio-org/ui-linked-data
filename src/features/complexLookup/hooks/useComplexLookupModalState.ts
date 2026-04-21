import { useEffect } from 'react';

import { normalizeQuery } from '@/features/search/core';

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
  const normalizedInitialQuery = initialQuery ? (normalizeQuery(initialQuery) ?? '') : '';
  const assignedSource = assignedValue?.meta?.sourceType;
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

      // Set committed values with normalized initial query and source
      // This triggers useSearchQuery to auto-execute the search via its enabled flag
      setCommittedValues({
        segment: defaultSegment,
        query: normalizedInitialQuery,
        searchBy: undefined,
        source: initialSource,
        offset: 0,
      });

      // Set draft query to populate the input field and save to segment draft
      if (initialQuery) {
        // Store the original query in the input field for user editing
        setQuery(initialQuery);

        // Save raw query to segment draft
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
  }, [isOpen, initialQuery, normalizedInitialQuery, defaultSegment, initialSource]);
}
