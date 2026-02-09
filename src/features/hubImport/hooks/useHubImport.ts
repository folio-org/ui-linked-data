import { useNavigate } from 'react-router-dom';

import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { getRecordId } from '@/common/helpers/record.helper';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useStatusState } from '@/store';

import { getHubByToken } from '../api/hubImport.api';

export const useHubImport = () => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { getRecordAndInitializeParsing } = useRecordControls();
  const navigate = useNavigate();

  const fetchHubForPreview = async (hubToken: string, source?: string) => {
    if (!hubToken) return;

    setIsLoading(true);

    try {
      const hubRecord = await getHubByToken({ hubToken, source });

      await getRecordAndInitializeParsing({
        cachedRecord: hubRecord,
        errorMessage: 'ld.errorFetchingHubForPreview',
      });
    } catch (err) {
      console.error('Error fetching hub for preview:', err);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetchingHubForPreview'));
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchHubForPreview,
    importHubForEdit,
  };
};
