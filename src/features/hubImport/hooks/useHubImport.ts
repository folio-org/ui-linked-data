import { useNavigate } from 'react-router-dom';

import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { getRecordId } from '@/common/helpers/record.helper';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useStatusState } from '@/store';

import { getHubById } from '../api/hubImport.api';

export const useHubImport = () => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const navigate = useNavigate();

  const importHubForEdit = async (hubId: string, source?: string) => {
    if (!hubId) return;

    try {
      setIsLoading(true);

      const record = await getHubById({ hubId, source });
      const id = getRecordId(record);

      if (id) {
        navigate(generateEditResourceUrl(id), { replace: true });
      }
    } catch (err: unknown) {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, getFriendlyErrorMessage(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    importHubForEdit,
  };
};
