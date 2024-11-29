import { UserNotificationFactory } from '@common/services/userNotification';
import { useStatusState } from '@src/store';

export const useCommonStatus = () => {
  const { addStatusMessages } = useStatusState();

  return {
    set: (l10nId: string, type: StatusType) => {
      addStatusMessages?.(UserNotificationFactory.createMessage(type, l10nId));
    },
  };
};
