import { StatusType } from '../../../constants/status.constants';
import BaseNotification from './base';

export default class InfoNotification extends BaseNotification {
  constructor(message: string) {
    super(StatusType.info, message);
  }
}
