import { useCallback, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getHubByUri, normalizeExternalHubUri } from '@/common/api/hub.api';
import { StatusType } from '@/common/constants/status.constants';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { type ProcessedResource, useResourceProcessing } from '@/features/resources';

import { useInputsState, useProfileState, useStatusState } from '@/store';

interface UseHubQueryParams {
  hubUri?: string;
  enabled?: boolean;
}

interface UseHubQueryResult {
  data: RecordEntry | undefined;
  processed: ProcessedResource | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

type HubQueryData = {
  hubRecord: RecordEntry;
  processed: ProcessedResource;
};

export function useHubQuery({ hubUri, enabled = true }: UseHubQueryParams): UseHubQueryResult {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { processResource } = useResourceProcessing();
  const { setSelectedProfile, setInitialSchemaKey, setSchema } = useProfileState([
    'setSelectedProfile',
    'setInitialSchemaKey',
    'setSchema',
  ]);
  const { setRecord, setUserValues, setSelectedEntries, setSelectedRecordBlocks } = useInputsState([
    'setRecord',
    'setUserValues',
    'setSelectedEntries',
    'setSelectedRecordBlocks',
  ]);

  const queryKey = ['hub', hubUri];

  const queryFn = useCallback(
    async ({ signal }: { signal: AbortSignal }): Promise<HubQueryData | undefined> => {
      if (!hubUri) {
        return undefined;
      }

      try {
        const normalizedUri = normalizeExternalHubUri(hubUri);
        const hubRecord = await getHubByUri({
          hubUri: normalizedUri,
          signal,
        });

        const processed = await processResource({ record: hubRecord });

        if (!processed) {
          throw new Error('ld.errorFetchingHubForPreview');
        }

        return { hubRecord, processed };
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
    [hubUri, addStatusMessagesItem, processResource],
  );

  const shouldEnable = enabled && !!hubUri;

  const {
    data: queryData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<HubQueryData | undefined>({
    queryKey,
    queryFn,
    enabled: shouldEnable,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!queryData) return;

    const { hubRecord, processed } = queryData;
    setRecord(hubRecord);
    setSelectedProfile(processed.selectedProfile ?? null);
    setSchema(processed.schema);
    setInitialSchemaKey(processed.initKey);
    setUserValues(processed.userValues);
    setSelectedEntries(processed.selectedEntries);
    setSelectedRecordBlocks(processed.selectedRecordBlocks);
  }, [
    queryData,
    setRecord,
    setSelectedProfile,
    setSchema,
    setInitialSchemaKey,
    setUserValues,
    setSelectedEntries,
    setSelectedRecordBlocks,
  ]);

  const refetch = useCallback(async () => {
    if (hubUri) {
      await queryRefetch();
    }
  }, [queryRefetch, hubUri]);

  return {
    data: queryData?.hubRecord,
    processed: queryData?.processed,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
