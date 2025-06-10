import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
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

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    const values = userValues[profileSchemaEntry.uuid]?.contents || [];

    return this.processLookupValues(recordSchemaEntry, values);
  }

  private processLookupValues(recordSchemaEntry: RecordSchemaEntry, values: UserValueContents[]) {
    if (!recordSchemaEntry.properties || values.length === 0) {
      return [];
    }

    return values.map(({ meta, label }) => {
      const result: GeneratedValue = {};

      Object.keys(recordSchemaEntry.properties || {}).forEach(key => {
        this.mapEntryValue(result, key, meta, label);
      });

      return result;
    });
  }

  private mapEntryValue(
    result: GeneratedValue,
    key: string,
    meta: UserValueContents['meta'] | undefined,
    label?: string,
  ) {
    if (meta?.uri && key.includes('link')) {
      result[key] = [meta.uri];
    } else if (meta?.basicLabel && (key.includes('term') || key.includes('label') || key.includes('name'))) {
      result[key] = [meta.basicLabel];
    } else if (key.includes('code')) {
      result[key] = [meta?.uri?.split('/').pop() ?? label ?? ''];
    } else {
      result[key] = label ? [label] : [];
    }
  }
}
