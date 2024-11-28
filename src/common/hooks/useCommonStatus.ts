import { UserNotificationFactory } from '@common/services/userNotification';
import { useStoreSelector } from '@common/hooks/useStoreSelectors';

export const useCommonStatus = () => {
  const { addStatusMessages } = useStoreSelector().status;

  return {
    set: (l10nId: string, type: StatusType) => {
      addStatusMessages(UserNotificationFactory.createMessage(type, l10nId));
    },
  };
};
