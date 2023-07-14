import { StatusType } from '../../../constants/status.constants';
import BaseNotification from './base';

export default class WarningNotification extends BaseNotification {
  constructor(message: string) {
    super(StatusType.warning, message);
  }
}
