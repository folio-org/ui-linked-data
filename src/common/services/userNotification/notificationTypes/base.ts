import { v4 as uuidv4 } from 'uuid';
import { StatusType } from '../../../constants/status.constants';

export interface INotification {
  id: string;
  type: StatusType;
  message: string;
}

export default abstract class BaseNotification implements INotification {
  id: string;
  type: StatusType;
  message: string;

  constructor(type: StatusType, message: string) {
    this.id = uuidv4();
    this.type = type;
    this.message = message;
  }
}
