import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';

import { BaseValueFormatter } from './baseValueFormatter';

export class GroupValueFormatter extends BaseValueFormatter {
  formatSimple(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry) {
    if (!value.meta?.uri) return [];

    if (recordSchemaEntry?.options?.mappedValues) {
      const mappedUri = Object.entries(recordSchemaEntry.options.mappedValues).find(
        ([, mappedValue]) => mappedValue.uri === value.meta?.uri,
      )?.[0];

      if (mappedUri) return [mappedUri];
    }

    if (recordSchemaEntry?.options?.includeTerm) {
      return {
        [BFLITE_URIS.LINK]: [value.meta.uri],
        [BFLITE_URIS.TERM]: [value.meta?.basicLabel ?? value.label ?? ''],
      };
    }

    return [value.meta.uri];
  }
}
