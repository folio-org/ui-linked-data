import { useCallback, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getRecord } from '@/common/api/records.api';
import { StatusType } from '@/common/constants/status.constants';
import { useConfig } from '@/common/hooks/useConfig.hook';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

interface HubResourceData {
  base: Schema;
  userValues: UserValues;
  initKey: string;
}

interface HubPreviewData {
  id: string;
  resource: HubResourceData;
}

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
  previewMeta: { id: string; title: string } | null;
}

/**
 * Hook for handling hub preview.
 */
export function useHubPreviewQuery({ isPreviewOpen }: UseHubPreviewParams): UseHubPreviewResult {
  const [previewMeta, setPreviewMeta] = useState<{ id: string; title: string } | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const { getProfiles } = useConfig();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const {
    data: previewData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['hubPreview', selectedRecordId],
    queryFn: async ({ signal }: { signal: AbortSignal }): Promise<HubPreviewData | null> => {
      if (!selectedRecordId) return null;

      try {
        const recordData: RecordEntry = await getRecord({ recordId: selectedRecordId, signal });

        // Get generated preview data without updating previewContent store
        const generatedData = await getProfiles({
          record: recordData,
          recordId: selectedRecordId,
          previewParams: { noStateUpdate: true },
          skipPreviewContentUpdate: true,
        });

        if (!generatedData) return null;

        return {
          id: selectedRecordId,
          resource: {
            base: generatedData.base,
            userValues: generatedData.userValues,
            initKey: generatedData.initKey,
          },
        };
      } catch (error) {
        // Don't show error for cancelled requests
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadHubPreview'));
        throw error;
      }
    },
    enabled: !!selectedRecordId && isPreviewOpen,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loadHubPreview = useCallback((id: string, title: string) => {
    setSelectedRecordId(id);
    setPreviewMeta({ id, title });
  }, []);

  const resetPreview = useCallback(() => {
    setSelectedRecordId(undefined);
    setPreviewMeta(null);
  }, []);

  return {
    loadHubPreview,
    resetPreview,
    previewData: previewData ?? null,
    isLoading: isLoading || isFetching,
    isFetching,
    isError,
    error,
    previewMeta,
  };
}
