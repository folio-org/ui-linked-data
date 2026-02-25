import { useCallback } from 'react';

import { usePreviewQuery } from '@/common/hooks/usePreviewQuery';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';

import { useUIState } from '@/store';

interface HubSearchPreviewResult {
  success: boolean;
  previewId?: string;
  error?: unknown;
}

/**
 * Hook for triggering a hub record preview on the Search page.
 * Fetches the hub record and populates the FullDisplay preview panel.
 */
export const useHubSearchPreviewQuery = () => {
  const { fetchRecord } = useRecordControls();
  const { resetFullDisplayComponentType } = useUIState(['resetFullDisplayComponentType']);

  const fetchHubForPreview = useCallback(
    async (id: string, signal: AbortSignal): Promise<HubSearchPreviewResult> => {
      try {
        await fetchRecord(id, { singular: true }, signal);

        return { success: true, previewId: id };
      } catch (error) {
        logger.error('Error fetching hub record:', error);

        return { success: false, error };
      }
    },
    [fetchRecord],
  );

  const { loadPreview, isLoading } = usePreviewQuery<HubSearchPreviewResult>({
    queryKey: 'hub-search-preview',
    fetchFn: fetchHubForPreview,
    enabled: true,
    errorMessage: 'ld.errorFetching',
  });

  const loadHubPreview = useCallback(
    (id: string) => {
      resetFullDisplayComponentType();
      loadPreview(id);
    },
    [resetFullDisplayComponentType, loadPreview],
  );

  return { loadHubPreview, isLoading };
};
