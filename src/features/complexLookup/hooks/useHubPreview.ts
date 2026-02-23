import { useCallback, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getRecord } from '@/common/api/records.api';
import { useConfig } from '@/common/hooks/useConfig.hook';

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
  previewMeta: { id: string; title: string } | null;
}

/**
 * Hook for handling hub preview.
 */
export function useHubPreview({ isPreviewOpen }: UseHubPreviewParams): UseHubPreviewResult {
  const [previewMeta, setPreviewMeta] = useState<{ id: string; title: string } | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const { getProfiles } = useConfig();

  const {
    data: previewData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['hubPreview', selectedRecordId],
    queryFn: async (): Promise<HubPreviewData | null> => {
      if (!selectedRecordId) return null;

      const recordData: RecordEntry = await getRecord({ recordId: selectedRecordId });

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
    previewMeta,
  };
}
