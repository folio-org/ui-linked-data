import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, id, uuid, type } = value;
    const typedData = data as string;

    let contents;

    if (Array.isArray(typedData)) {
      contents = typedData.map(dataElem => {
        const isObject = typeof dataElem === 'object';

        return {
          id: isObject ? dataElem.id : id,
          label: isObject ? dataElem.label[0] : dataElem,
          meta: {
            type,
          },
        };
      });
    } else {
      const contentItem: WithRequired<UserValueContents, 'meta'> = {
        id,
        label: typeof data === 'string' ? typedData : (data as RecordBasic)?.value?.[0],
        meta: {
          type,
        },
      };
      const isPreferred = (data as Record<string, boolean>)?.isPreferred;
      const hasPreferredValue = isPreferred !== undefined;

      if (hasPreferredValue) {
        contentItem.meta.isPreferred = isPreferred;
      }

      contents = [contentItem];
    }

    return {
      uuid: uuid ?? '',
      contents,
    };
  }
}
