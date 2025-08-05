import { IUserValueType } from './userValueType.interface';
import { UserValueType } from './userValueType';

export class EnumeratedUserValueService extends UserValueType implements IUserValueType {
  private contents?: UserValueContents[];

  async generate({ data, uri, uuid, type }: UserValueDTO) {
    this.contents = [];

    if (Array.isArray(data)) {
      for (const dataEntry of data as string[]) {
        const itemUri = dataEntry;
        this.generateContentItem({
          label: itemUri,
          itemUri,
          uri,
          type,
        });
      }
    } else {
      const itemUri = data as string;
      this.generateContentItem({
        label: itemUri,
        itemUri,
        uri,
        type,
      });
    }

    this.value = {
      uuid: uuid ?? '',
      contents: this.contents,
    };

    return this.value;
  }

  private generateContentItem({
    label,
    itemUri,
    uri,
    type,
  }: {
    label?: string;
    itemUri?: string;
    uri?: string;
    type?: AdvancedFieldType;
  }) {
    // Use a default empty string if label is undefined
    const safeLabel = label || '';

    const contentItem = {
      label: safeLabel,
      meta: {
        parentUri: uri,
        uri: itemUri,
        type,
        basicLabel: safeLabel,
      },
    };

    this.contents?.push(contentItem);
  }
}
