import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class EnumeratedUserValueService extends UserValueType implements IUserValueType {
  private contents?: UserValueContents[];

  async generate({ data, uuid, type }: UserValueDTO) {
    this.contents = [];

    if (Array.isArray(data)) {
      for (const dataEntry of data as string[]) {
        const itemUri = dataEntry;
        this.generateContentItem({
          itemUri,
          type,
        });
      }
    } else {
      const itemUri = data as string;
      this.generateContentItem({
        itemUri,
        type,
      });
    }

    this.value = {
      uuid: uuid ?? '',
      contents: this.contents,
    };

    return this.value;
  }

  private generateContentItem({ itemUri, type }: { itemUri?: string; type?: AdvancedFieldType }) {
    const contentItem = {
      label: itemUri,
      meta: {
        uri: itemUri,
        type,
        basicLabel: itemUri,
      },
    };

    this.contents?.push(contentItem);
  }
}
