import { StatusType } from '../../../constants/status.constants';
import BaseNotification from './base';

export default class SuccessNotification extends BaseNotification {
  constructor(message: string) {
    super(StatusType.success, message);
  }
}
