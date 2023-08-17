import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import SuccessNotification from '@common/services/userNotification/notificationTypes/success';
import ErrorNotification from '@common/services/userNotification/notificationTypes/error';
import InfoNotification from '@common/services/userNotification/notificationTypes/info';
import WarningNotification from '@common/services/userNotification/notificationTypes/warning';

jest.mock('@common/services/userNotification/notificationTypes/success');
jest.mock('@common/services/userNotification/notificationTypes/error');
jest.mock('@common/services/userNotification/notificationTypes/info');
jest.mock('@common/services/userNotification/notificationTypes/warning');

describe('UserNotificationFactory', () => {
  type Class = { new (...args: any[]): any };

  const testNotificationInstance = (notificationClass: Class, notificationType: StatusType) => {
    const message = 'test message';
    const instance = UserNotificationFactory.createMessage(notificationType, message);

    expect(instance instanceof notificationClass).toBeTruthy();
    expect(notificationClass).toHaveBeenCalledWith(message);
  };

  test('creates an instance of SuccessNotification', () => {
    testNotificationInstance(SuccessNotification, 'success' as StatusType);
  });

  test('creates an instance of ErrorNotification', () => {
    testNotificationInstance(ErrorNotification, 'error' as StatusType);
  });

  test('creates an instance of InfoNotification', () => {
    testNotificationInstance(InfoNotification, 'info' as StatusType);
  });

  test('creates an instance of WarningNotification', () => {
    testNotificationInstance(WarningNotification, 'warning' as StatusType);
  });
});
