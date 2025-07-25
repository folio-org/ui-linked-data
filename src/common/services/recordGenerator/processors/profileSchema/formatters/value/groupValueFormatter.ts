import { IValueFormatter } from './valueFormatter.interface';

export class GroupValueFormatter implements IValueFormatter {
  formatLiteral(value: UserValueContents) {
    return value.label ? [value.label] : [];
  }

  formatSimple(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry) {
    if (!value.meta?.uri) return [];

    if (recordSchemaEntry?.options?.mappedValues) {
      const mappedUri = Object.entries(recordSchemaEntry.options.mappedValues).find(
        ([, mappedValue]) => mappedValue.uri === value.meta?.uri,
      )?.[0];

      if (mappedUri) return [mappedUri];
    }

    return [value.meta.uri];
  }

  formatComplex(value: UserValueContents) {
    const selectedId = value.meta?.srsId ?? value.id ?? '';

    return Array.isArray(selectedId) ? selectedId[0] : selectedId;
  }
}
