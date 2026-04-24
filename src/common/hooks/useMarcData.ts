import { getMarcRecord } from '@/common/api/records.api';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useStatusState } from '@/store';

import { logger } from '../services/logger';

type SetMarcPreviewData = (value: MarcDTO | null) => void;

export const useMarcData = (setMarcPreviewData: SetMarcPreviewData) => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const fetchMarcData = async (recordId?: string, endpointUrl?: string): Promise<MarcDTO | undefined> => {
    if (!recordId) return undefined;

    let marcData: MarcDTO | undefined;

    try {
      setIsLoading(true);

      marcData = await getMarcRecord({ recordId, endpointUrl });

      setMarcPreviewData(marcData);
    } catch (error) {
      logger.error('Error occurred while fetching MARC data', error);
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadMarc'));
    } finally {
      setIsLoading(false);
    }

    return marcData;
  };

  return { fetchMarcData };
};
