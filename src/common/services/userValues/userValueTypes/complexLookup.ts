import { IUserValueType } from './userValueType.interface';

export class ComplexLookupUserValueService implements IUserValueType {
  generate(value: UserValueDTO) {
    const { data, id, uuid, type } = value;

    return {
      uuid: uuid ?? '',
      contents: this.generateContents(data, id, type),
    };
  }

  private generateContents(data: unknown, id?: string, type?: string) {
    return Array.isArray(data) ? this.handleArrayData(data, id, type) : this.handleSingleData(data, id, type);
  }

  private handleArrayData(data: unknown[], id?: string, type?: string) {
    return data.map(item => ({
      id: this.getId(item, id),
      label: this.getLabel(item),
      meta: { type },
    }));
  }

  private handleSingleData(data: unknown, id?: string, type?: string) {
    const contentItem: WithRequired<UserValueContents, 'meta'> = {
      id,
      label: this.getSingleLabel(data),
      meta: {
        type,
        ...this.getPreferredMeta(data),
      },
    };

    return [contentItem];
  }

  private getId(item: unknown, defaultId?: string) {
    return (item as { id?: string })?.id ?? defaultId;
  }

  private getLabel(item: unknown) {
    return typeof item === 'object' ? (item as { label: string[] })?.label[0] : String(item);
  }

  private getSingleLabel(data: unknown) {
    return typeof data === 'string' ? data : ((data as RecordBasic)?.value?.[0] ?? '');
  }

  private getPreferredMeta(data: unknown) {
    const isPreferred = (data as Record<string, boolean>)?.isPreferred;

    return isPreferred !== undefined ? { isPreferred } : {};
  }
}
