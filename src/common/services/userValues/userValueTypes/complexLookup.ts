import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, id, uuid, type } = value;
    const typedData = data as string;

    return {
      uuid: uuid || '',
      contents: [
        {
          id,
          label: Array.isArray(typedData) ? typedData[0] : typedData,
          meta: {
            type,
          },
        },
      ],
    };
  }
}
