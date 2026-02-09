import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { StatusType } from '@/common/constants/status.constants';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

import { getHubByToken } from '../api/hubImport.api';

interface UseHubQueryParams {
  hubToken?: string;
  source?: string;
  enabled?: boolean;
}

interface UseHubQueryResult {
  data: RecordEntry | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useHubQuery({ hubToken, source, enabled = true }: UseHubQueryParams): UseHubQueryResult {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { getRecordAndInitializeParsing } = useRecordControls();

  const queryKey = ['hub', hubToken, source];

  const queryFn = useCallback(
    async ({ signal }: { signal: AbortSignal }): Promise<RecordEntry | undefined> => {
      if (!hubToken) {
        return undefined;
      }

      try {
        const hubRecord = await getHubByToken({
          hubToken,
          source,
          signal,
        });

        // Initialize record for preview
        await getRecordAndInitializeParsing({
          cachedRecord: hubRecord,
          errorMessage: 'ld.errorFetchingHubForPreview',
        });

        return hubRecord;
      } catch (error) {
        // Don't show error for cancelled requests
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        logger.error('Error fetching hub for preview:', error);
        addStatusMessagesItem?.(
          UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetchingHubForPreview'),
        );
        throw error;
      }
    },
    [hubToken, source, addStatusMessagesItem, getRecordAndInitializeParsing],
  );

  const shouldEnable = enabled && !!hubToken;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<RecordEntry | undefined>({
    queryKey,
    queryFn,
    enabled: shouldEnable,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const refetch = useCallback(async () => {
    if (hubToken) {
      await queryRefetch();
    }
  }, [queryRefetch, hubToken]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
