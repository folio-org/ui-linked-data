import { useSetRecoilState } from 'recoil';
import { getMarcRecord } from '@common/api/records.api';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useStatusState } from '@src/store';
import state from '@state';

export const useMarcData = (setMarcPreviewData: (value: any) => void) => {
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const { addStatusMessages } = useStatusState();

  const fetchMarcData = async (recordId?: string, endpointUrl?: string): Promise<MarcDTO | undefined> => {
    if (!recordId) return undefined;

    let marcData;

    try {
      setIsLoading(true);

      marcData = await getMarcRecord({ recordId, endpointUrl });

      setMarcPreviewData(marcData);
    } catch (error) {
      addStatusMessages?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadMarc'));
    } finally {
      setIsLoading(false);
    }

    return marcData;
  };

  return { fetchMarcData };
};
