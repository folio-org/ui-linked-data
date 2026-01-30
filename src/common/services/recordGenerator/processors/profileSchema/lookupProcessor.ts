import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ProcessContext } from '../../types/common.types';
import { GeneratedValue } from '../../types/value.types';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';

export class LookupProcessor implements IProfileSchemaProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      recordSchemaEntry.type === RecordSchemaEntryType.array &&
      recordSchemaEntry.value === RecordSchemaEntryType.object &&
      (profileSchemaEntry.type === AdvancedFieldType.complex || profileSchemaEntry.type === AdvancedFieldType.simple)
    );
  }

  process({ profileSchemaEntry, userValues, recordSchemaEntry }: ProcessContext) {
    const values = userValues[profileSchemaEntry.uuid]?.contents || [];

    return this.processLookupValues(recordSchemaEntry, values);
  }

  private processLookupValues(recordSchemaEntry: RecordSchemaEntry, values: UserValueContents[]) {
    if (!recordSchemaEntry.properties || values.length === 0) {
      return [];
    }

    return values.map(({ id, meta, label }) => {
      const result: GeneratedValue = {};

      Object.keys(recordSchemaEntry.properties || {}).forEach(key => {
        this.mapEntryValue({ result, key, meta, label, id });
      });

      return result;
    });
  }

  private mapEntryValue({
    result,
    key,
    meta,
    label,
    id,
  }: {
    result: GeneratedValue;
    key: string;
    meta?: UserValueContents['meta'];
    label?: string;
    id?: string;
  }) {
    if (meta?.uri && key.includes('link')) {
      result[key] = [meta.uri];
    } else if (meta?.basicLabel && (key.includes('term') || key.includes('label') || key.includes('name'))) {
      result[key] = [meta.basicLabel];
    } else if (key.includes('code')) {
      result[key] = [meta?.uri?.split('/').pop() ?? label ?? ''];
    } else if (key.includes('srsId')) {
      const selectedKey = meta?.srsId ? 'srsId' : 'id';

      result[selectedKey] = meta?.srsId ?? id;
    } else {
      result[key] = label ? [label] : [];
    }
  }
}
