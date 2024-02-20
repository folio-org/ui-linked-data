import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class SimpleLookupUserValueService extends UserValueType implements IUserValueType {
  async generate({ data, uri, uuid, labelSelector, uriSelector, type }: UserValueDTO) {
    const contents = [];

    if (Array.isArray(data)) {
      for await (const dataEntry of data as Record<string, string[]>[]) {
        contents.push({
          label: dataEntry[labelSelector as string]?.[0],
          meta: {
            parentURI: dataEntry[uriSelector as string]?.[0],
            uri,
            type,
          },
        });
      }
    } else {
      const typedData = data as Record<string, string[]>;
      const contentItem = {
        label: typedData[labelSelector as string]?.[0],
        meta: {
          parentURI: typedData[uriSelector as string]?.[0],
          uri,
          type,
        },
      };

      contents.push(contentItem);
    }

    this.value = {
      uuid,
      contents,
    };
  }
}
