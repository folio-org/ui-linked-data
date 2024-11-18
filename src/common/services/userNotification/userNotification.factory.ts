import { StatusType as Status } from '@common/constants/status.constants';
import { Success, Error as ErrorNotification, Info, Warning } from './notificationTypes';
import BaseNotification from './notificationTypes/base';

const notificationMap = {
  [Status.success]: Success,
  [Status.error]: ErrorNotification,
  [Status.info]: Info,
  [Status.warning]: Warning,
};

const DefaultNotification = Info as unknown as BaseNotification;

type notificationTypes = (typeof notificationMap)[StatusType];
type ExtractInstanceType<T> = T extends new () => infer R ? R : typeof DefaultNotification;

export default class UserNotificationFactory {
  public static createMessage(type: StatusType, message: string): ExtractInstanceType<notificationTypes> {
    return new notificationMap[type](message);
  }
}
