import { UserNotificationFactory } from '@common/services/userNotification';
import state from '@state';
import { useSetRecoilState } from 'recoil';

export const useCommonStatus = () => {
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);

  return {
    set: (l10nId: string, type: StatusType) => {
      setCommonStatus(currentStatus => [...currentStatus, UserNotificationFactory.createMessage(type, l10nId)]);
    },
  };
};
