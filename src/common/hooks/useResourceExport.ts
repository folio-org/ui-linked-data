import { getRdfRecord } from '@common/api/records.api';
import { initiateUserAgentDownload } from '@common/helpers/download.helper';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useStatusState } from '@src/store';

export const useResourceExport = () => {
  const { setIsLoading } = useLoadingState();
  const { addStatusMessagesItem } = useStatusState();

  const exportInstanceRdf = async (resourceId: string) => {
    try {
      setIsLoading(true);

      const response = await getRdfRecord(resourceId);
      if (response?.ok) {
        const rdf = await response.blob();
        initiateUserAgentDownload(rdf, `${resourceId}.json`);
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorExportingRdf'));
    } finally {
      setIsLoading(false);
    }
  };

  return { exportInstanceRdf };
};
