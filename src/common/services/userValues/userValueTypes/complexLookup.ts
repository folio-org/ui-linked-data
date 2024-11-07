import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, id, uuid, type } = value;
    const typedData = data as string;

    return {
      uuid: uuid ?? '',
      contents: Array.isArray(typedData)
        ? typedData.map(dataElem => {
            const isObject = typeof dataElem === 'object';

            return {
              id: isObject ? dataElem.id : id,
              label: isObject ? dataElem.label[0] : dataElem,
              meta: {
                type,
              },
            };
          })
        : [
            {
              id,
              label: typedData,
              meta: {
                type,
              },
            },
          ],
    };
  }
}
