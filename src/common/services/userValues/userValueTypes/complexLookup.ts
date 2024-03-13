import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, uuid } = value;
    const typedData = data as string;

    return {
      uuid: uuid || '',
      contents: [{ label: Array.isArray(typedData) ? typedData[0] : typedData }],
    };
  }
}
