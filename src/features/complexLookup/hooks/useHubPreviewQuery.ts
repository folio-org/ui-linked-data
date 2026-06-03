import { useCallback, useState } from 'react';

import { HubPreviewData, HubPreviewMeta } from '@/features/complexLookup/types/hubPreview.types';
import { useResourcePreviewQuery } from '@/features/resources';

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

export function useHubPreviewQuery({ isPreviewOpen }: UseHubPreviewParams): UseHubPreviewResult {
  const [selectedHubId, setSelectedHubId] = useState<string | undefined>();
  const [previewMeta, setPreviewMeta] = useState<HubPreviewMeta | null>(null);

  const { data, isLoading, isFetching, isError, error } = useResourcePreviewQuery(selectedHubId, 'hub-lookup', {
    enabled: isPreviewOpen,
  });

  const previewData: HubPreviewData | null =
    data && selectedHubId
      ? {
          id: selectedHubId,
          resource: {
            base: data.schema,
            userValues: data.userValues,
            initKey: data.initKey,
          },
        }
      : null;

  const loadHubPreview = useCallback((id: string, title: string) => {
    setSelectedHubId(id);
    setPreviewMeta({ id, title });
  }, []);

  const resetPreview = useCallback(() => {
    setSelectedHubId(undefined);
    setPreviewMeta(null);
  }, []);

  return {
    loadHubPreview,
    resetPreview,
    previewData,
    isLoading: isLoading || isFetching,
    isFetching,
    isError,
    error,
    previewMeta,
  };
}
