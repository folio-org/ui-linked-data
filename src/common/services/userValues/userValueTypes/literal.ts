import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class LiteralUserValueService extends UserValueType implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, uuid } = value;

    this.value = {
      uuid,
      contents: [{ label: Array.isArray(data) ? data[0] : data }],
    };
  }
}
