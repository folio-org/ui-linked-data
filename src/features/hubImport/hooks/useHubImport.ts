import { useNavigate } from 'react-router-dom';

import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { getRecordId } from '@/common/helpers/record.helper';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useStatusState } from '@/store';

import { getHubByToken } from '../api/hubImport.api';

export const useHubImport = () => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const navigate = useNavigate();

  const importHubForEdit = async (hubToken: string, source?: string) => {
    if (!hubToken) return;

    try {
      setIsLoading(true);

      const record = await getHubByToken({ hubToken, source });
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
