import { UserNotificationFactory } from '@common/services/userNotification';
import { useStatusState } from '@src/store';

export const useCommonStatus = () => {
  const { addStatusMessage } = useStatusState();

  return {
    set: (l10nId: string, type: StatusType) => {
      addStatusMessage?.(UserNotificationFactory.createMessage(type, l10nId));
    },
  };
};
