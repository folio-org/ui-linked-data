import { useCallback, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import { StatusType } from '@/common/constants/status.constants';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState, useUIState } from '@/store';

/**
 * Hook for triggering a hub record preview on the Search page.
 * Fetches the hub record and populates the FullDisplay preview panel.
 */
export const useHubSearchPreview = () => {
  const { fetchRecord } = useRecordControls();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { resetFullDisplayComponentType } = useUIState(['resetFullDisplayComponentType']);
  const currentPreviewIdRef = useRef<string | null>(null);

  const { isFetching, refetch } = useQuery({
    queryKey: ['hub-preview'],
    queryFn: async () => {
      const previewId = currentPreviewIdRef.current;

      if (!previewId) {
        return { success: false };
      }

      try {
        await fetchRecord(previewId, { singular: true });
        return { success: true, previewId };
      } catch (error) {
        logger.error('Error fetching hub record:', error);
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
        return { success: false, error };
      }
    },
    enabled: false,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handlePreview = useCallback(
    (id: string) => {
      resetFullDisplayComponentType();
      currentPreviewIdRef.current = id;
      refetch();
    },
    [resetFullDisplayComponentType, refetch],
  );

  return { handlePreview, isLoading: isFetching };
};
