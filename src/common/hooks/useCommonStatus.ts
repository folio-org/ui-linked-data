import { UserNotificationFactory } from '@common/services/userNotification';
import { useStatusState } from '@src/store';

export const useCommonStatus = () => {
  const { addStatusMessagesItem } = useStatusState();

  return {
    set: (l10nId: string, type: StatusType) => {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(type, l10nId));
    },
  };
};
