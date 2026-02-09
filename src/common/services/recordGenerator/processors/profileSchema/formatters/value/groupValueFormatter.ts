import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';

import { BaseValueFormatter } from './baseValueFormatter';

export class GroupValueFormatter extends BaseValueFormatter {
  formatSimple(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry) {
    const uri = value.meta?.uri;
    const label = value.meta?.basicLabel ?? value.label ?? '';

    if (recordSchemaEntry?.options?.mappedValues) {
      const mappedUri = Object.entries(recordSchemaEntry.options.mappedValues).find(
        ([, mappedValue]) => mappedValue.uri === uri,
      )?.[0];

      if (mappedUri) return [mappedUri];
    }

    if (recordSchemaEntry?.options?.includeTerm) {
      return this.buildLinkLabelObject(BFLITE_URIS.TERM, label, uri);
    }

    if (uri) return [uri];

    return [];
  }
}
