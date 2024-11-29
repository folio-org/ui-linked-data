import { UserNotificationFactory } from '@common/services/userNotification';
import { useStatusStore } from '@src/store';

export const useCommonStatus = () => {
  const { addStatusMessages } = useStatusStore();

  return {
    set: (l10nId: string, type: StatusType) => {
      addStatusMessages?.(UserNotificationFactory.createMessage(type, l10nId));
    },
  };
};
