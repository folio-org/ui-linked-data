import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class LiteralUserValueService extends UserValueType implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, uuid } = value;
    const typedData = data as string | string[];

    this.value = {
      uuid: uuid || '',
      contents: [{ label: Array.isArray(typedData) ? typedData[0] : typedData }],
    };

    return this.value;
  }
}
