import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService extends UserValueType implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, uuid } = value;

    this.value = {
      uuid,
      contents: [{ label: data }],
    };
  }
}
