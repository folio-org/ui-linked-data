import { RecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { getMarcRecord } from '@common/api/records.api';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import state from '@state';

export const useMarcData = <T>(marcState: RecoilState<T>) => {
  const setMarcPreviewData = useSetRecoilState(marcState);
  const clearMarcData = useResetRecoilState(marcState);
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setStatus = useSetRecoilState(state.status.commonMessages);

  const fetchMarcData = async (recordId?: string, endpointUrl?: string): Promise<MarcDTO | undefined> => {
    if (!recordId) return undefined;

    let marcData;

    try {
      setIsLoading(true);

      marcData = await getMarcRecord({ recordId, endpointUrl });

      setMarcPreviewData(marcData);
    } catch (error) {
      setStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadMarc'),
      ]);
    } finally {
      setIsLoading(false);
    }

    return marcData;
  };

  return { fetchMarcData, clearMarcData };
};
