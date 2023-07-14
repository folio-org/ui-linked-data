import { StatusType } from '../../../constants/status.constants';
import BaseNotification from './base';

export default class ErrorNotification extends BaseNotification {
  constructor(message: string) {
    super(StatusType.error, message);
  }
}
