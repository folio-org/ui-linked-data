import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import baseApi from '@/common/api/base.api';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { useStatusState } from '@/store';

interface UseMarcQueryParams {
  recordId?: string;
  endpointUrl: string;
  enabled?: boolean;
}

interface UseMarcQueryResult {
  data: MarcDTO | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React Query hook for fetching MARC records.
 */
export function useMarcQuery({ recordId, endpointUrl, enabled = true }: UseMarcQueryParams): UseMarcQueryResult {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const queryKey = ['marc', recordId, endpointUrl];

  const queryFn = useCallback(
    async ({ signal }: { signal: AbortSignal }): Promise<MarcDTO | undefined> => {
      if (!recordId) {
        return undefined;
      }

      const url = baseApi.generateUrl(endpointUrl, {
        name: ':recordId',
        value: recordId,
      });

      try {
        const data = await baseApi.getJson({
          url,
          requestParams: {
            method: 'GET',
            signal, // Pass signal for request cancellation
          },
        });

        return data as MarcDTO;
      } catch (error) {
        // Don't show error for cancelled requests
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadMarc'));
        throw error;
      }
    },
    [recordId, endpointUrl, addStatusMessagesItem],
  );

  // Only enable query when recordId is provided and enabled flag is true
  const shouldEnable = enabled && !!recordId;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<MarcDTO | undefined>({
    queryKey,
    queryFn,
    enabled: shouldEnable,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const refetch = useCallback(async () => {
    if (recordId) {
      await queryRefetch();
    }
  }, [queryRefetch, recordId]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
