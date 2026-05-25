import { useCallback } from 'react';

import { useInputsState, useUIState } from '@/store';

/**
 * Hook for triggering a hub record preview on the Search page.
 * Sets the active preview ID so the FullDisplay panel fetches and shows the hub.
 */
export const useHubSearchPreviewQuery = () => {
  const { setActivePreviewIds } = useInputsState(['setActivePreviewIds']);
  const { resetFullDisplayComponentType } = useUIState(['resetFullDisplayComponentType']);

  const loadHubPreview = useCallback(
    (id: string) => {
      resetFullDisplayComponentType();
      setActivePreviewIds([id]);
    },
    [resetFullDisplayComponentType, setActivePreviewIds],
  );

  return { loadHubPreview, isLoading: false };
};
