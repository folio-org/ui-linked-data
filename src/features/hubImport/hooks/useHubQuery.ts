import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { StatusType } from '@/common/constants/status.constants';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

import { getHubByUri, normalizeExternalHubUri } from '../api/hubImport.api';

interface UseHubQueryParams {
  hubUri?: string;
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

export function useHubQuery({ hubUri, enabled = true }: UseHubQueryParams): UseHubQueryResult {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { getRecordAndInitializeParsing } = useRecordControls();

  const queryKey = ['hub', hubUri];

  const queryFn = useCallback(
    async ({ signal }: { signal: AbortSignal }): Promise<RecordEntry | undefined> => {
      if (!hubUri) {
        return undefined;
      }

      try {
        const normalizedUri = normalizeExternalHubUri(hubUri);
        const hubRecord = await getHubByUri({
          hubUri: normalizedUri,
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
    [hubUri, addStatusMessagesItem, getRecordAndInitializeParsing],
  );

  const shouldEnable = enabled && !!hubUri;

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
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const refetch = useCallback(async () => {
    if (hubUri) {
      await queryRefetch();
    }
  }, [queryRefetch, hubUri]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
