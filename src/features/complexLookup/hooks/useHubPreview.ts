import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useRecordControls } from '@/common/hooks/useRecordControls';

import { useInputsState } from '@/store';

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
  const { getRecordAndInitializeParsing } = useRecordControls();
  const { previewContent } = useInputsState(['previewContent']);

  const { isLoading, isFetching } = useQuery({
    queryKey: ['hubPreview', selectedRecordId],
    queryFn: async () => {
      if (!selectedRecordId) return null;

      const recordData = await getRecordAndInitializeParsing({
        recordId: selectedRecordId,
        previewParams: { singular: false, noStateUpdate: true },
      });

      return recordData;
    },
    enabled: !!selectedRecordId && isPreviewOpen,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const previewData = useMemo((): HubPreviewData | null => {
    if (!selectedRecordId) return null;

    const previewEntry = previewContent.find(({ id }) => id === selectedRecordId);

    if (!previewEntry) return null;

    return {
      id: selectedRecordId,
      resource: {
        base: previewEntry.base as Schema,
        userValues: previewEntry.userValues,
        initKey: previewEntry.initKey,
      },
    };
  }, [previewContent, selectedRecordId]);

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
    previewData,
    isLoading: isLoading || isFetching,
    previewMeta,
  };
}
