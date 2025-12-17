import { useEffect } from 'react';
import { useSearchState } from '@/store';

interface UseComplexLookupModalStateParams {
  isOpen: boolean;
  initialQuery?: string;
  defaultSegment: string;
  defaultSource?: string;
}

/**
 * Custom hook to manage search state lifecycle for complex lookup modals.
 * Resets all search state when modal opens and sets initial query if provided.
 * This ensures each modal starts with a clean state regardless of previous modal usage.
 */
export function useComplexLookupModalState({
  isOpen,
  initialQuery,
  defaultSegment,
  defaultSource,
}: UseComplexLookupModalStateParams): void {
  const {
    setQuery,
    resetQuery,
    resetSearchBy,
    setNavigationState,
    setCommittedValues,
    setDraftBySegment,
    resetDraftBySegment,
  } = useSearchState([
    'setQuery',
    'resetQuery',
    'resetSearchBy',
    'setNavigationState',
    'setCommittedValues',
    'setDraftBySegment',
    'resetDraftBySegment',
  ]);

  useEffect(() => {
    if (isOpen) {
      // Clear all search state from any previous modal
      resetQuery();
      resetSearchBy();

      // Set navigation state with the default segment to ensure correct tab is selected
      setNavigationState({
        segment: defaultSegment,
        ...(defaultSource ? { source: defaultSource } : {}),
      });

      // Set committed values with initial query if provided
      // This ensures useValueFlowAutoSubmit can detect and auto-execute the search
      setCommittedValues({
        segment: defaultSegment,
        query: initialQuery || '',
        searchBy: '',
        source: defaultSource,
        offset: 0,
      });

      // Set draft query to populate the input field and save to segment draft
      if (initialQuery) {
        setQuery(initialQuery);

        // Save initial query to segment draft so it persists when switching segments
        setDraftBySegment({
          [defaultSegment]: {
            query: initialQuery,
            searchBy: '',
            source: defaultSource,
          },
        });
      } else {
        // Clear drafts when no initial query
        resetDraftBySegment();
      }
    }
  }, [isOpen, initialQuery, defaultSegment, defaultSource]);
}
