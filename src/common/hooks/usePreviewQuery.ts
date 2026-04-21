import { useCallback, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

type PreviewMeta = Record<string, unknown>;

interface UsePreviewQueryParams<TData> {
  queryKey: string;
  fetchFn: (id: string, signal: AbortSignal) => Promise<TData | null>;
  enabled?: boolean;
  errorMessage?: string;
  onError?: (error: Error) => void;
}

interface UsePreviewQueryResult<TData> {
  loadPreview: (id: string, meta?: PreviewMeta) => void;
  resetPreview: () => void;
  previewData: TData | null;
  previewMeta: PreviewMeta | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Generic hook for handling preview queries with consistent error handling and state management.
 */
export function usePreviewQuery<TData>({
  queryKey,
  fetchFn,
  enabled = true,
  errorMessage = 'ld.errorFetching',
  onError,
}: UsePreviewQueryParams<TData>): UsePreviewQueryResult<TData> {
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [requestKey, setRequestKey] = useState(0);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [queryKey, selectedId, requestKey],
    queryFn: async ({ signal }) => {
      if (!selectedId) return null;

      try {
        return await fetchFn(selectedId, signal);
      } catch (error) {
        // Don't show error for cancelled requests
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, errorMessage));

        onError?.(error as Error);
        throw error;
      }
    },
    enabled: !!selectedId && enabled,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loadPreview = useCallback((id: string, meta?: PreviewMeta) => {
    setSelectedId(id);
    setRequestKey(prev => prev + 1);
    setPreviewMeta(meta ?? { id });
  }, []);

  const resetPreview = useCallback(() => {
    setSelectedId(undefined);
    setRequestKey(0);
    setPreviewMeta(null);
  }, []);

  return {
    loadPreview,
    resetPreview,
    previewData: data ?? null,
    previewMeta,
    isLoading: isLoading || isFetching,
    isFetching,
    isError,
    error,
  };
}
