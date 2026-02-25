import { useCallback } from 'react';

import { getRecord } from '@/common/api/records.api';
import { useConfig } from '@/common/hooks/useConfig.hook';
import { usePreviewQuery } from '@/common/hooks/usePreviewQuery';

import { HubPreviewData, HubPreviewMeta } from '@/features/complexLookup/types/hubPreview.types';

interface UseHubPreviewParams {
  isPreviewOpen: boolean;
}

interface UseHubPreviewResult {
  loadHubPreview: (id: string, title: string) => void;
  resetPreview: () => void;
  previewData: HubPreviewData | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  previewMeta: HubPreviewMeta | null;
}

/**
 * Hook for handling hub preview in complex lookup modals.
 */
export function useHubPreviewQuery({ isPreviewOpen }: UseHubPreviewParams): UseHubPreviewResult {
  const { getProfiles } = useConfig();

  const fetchHubPreview = useCallback(
    async (recordId: string, signal: AbortSignal): Promise<HubPreviewData | null> => {
      const recordData: RecordEntry = await getRecord({ recordId, signal });

      // Get generated preview data without updating previewContent store
      const generatedData = await getProfiles({
        record: recordData,
        recordId,
        previewParams: { noStateUpdate: true },
        skipPreviewContentUpdate: true,
      });

      if (!generatedData) return null;

      return {
        id: recordId,
        resource: {
          base: generatedData.base,
          userValues: generatedData.userValues,
          initKey: generatedData.initKey,
        },
      };
    },
    [getProfiles],
  );

  const { loadPreview, resetPreview, previewData, previewMeta, isLoading, isFetching, isError, error } =
    usePreviewQuery<HubPreviewData>({
      queryKey: 'hubPreview',
      fetchFn: fetchHubPreview,
      enabled: isPreviewOpen,
      errorMessage: 'ld.cantLoadHubPreview',
    });

  const loadHubPreview = useCallback(
    (id: string, title: string) => {
      loadPreview(id, { id, title });
    },
    [loadPreview],
  );

  return {
    loadHubPreview,
    resetPreview,
    previewData,
    isLoading,
    isFetching,
    isError,
    error,
    previewMeta: previewMeta as HubPreviewMeta | null,
  };
}
