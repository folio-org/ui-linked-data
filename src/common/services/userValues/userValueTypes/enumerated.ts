import { UserValueType } from './userValueType';
import { IUserValueType } from './userValueType.interface';

export class EnumeratedUserValueService extends UserValueType implements IUserValueType {
  private contents?: UserValueContents[];

  async generate({ data, uuid, type, labelMap }: UserValueDTO) {
    this.contents = [];

    if (Array.isArray(data)) {
      for (const dataEntry of data as string[]) {
        const itemUri = dataEntry;
        this.generateContentItem({
          itemUri,
          type,
          labelMap,
        });
      }
    } else {
      const itemUri = data as string;
      this.generateContentItem({
        itemUri,
        type,
        labelMap,
      });
    }

    this.value = {
      uuid: uuid ?? '',
      contents: this.contents,
    };

    return this.value;
  }

  private generateContentItem({
    itemUri,
    type,
    labelMap,
  }: {
    itemUri?: string;
    type?: AdvancedFieldType;
    labelMap?: Record<string, string>;
  }) {
    const resolvedLabel = (itemUri && labelMap?.[itemUri]) || itemUri;
    const contentItem = {
      label: resolvedLabel,
      meta: {
        uri: itemUri,
        type,
        basicLabel: resolvedLabel,
      },
    };

    this.contents?.push(contentItem);
  }
}
