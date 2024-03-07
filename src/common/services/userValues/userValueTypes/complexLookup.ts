import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService extends UserValueType implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, uuid } = value;
    const typedData = data as string;

    this.value = {
      uuid: uuid || '',
      contents: [{ label: typedData }],
    };

    return this.value;
  }
}
