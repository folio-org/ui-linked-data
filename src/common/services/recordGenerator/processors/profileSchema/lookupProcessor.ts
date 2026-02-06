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
        const propertySchema = recordSchemaEntry.properties?.[key];

        // Handle nested object properties
        if (propertySchema?.type === RecordSchemaEntryType.object && propertySchema.properties) {
          result[key] = this.processNestedObject(propertySchema, { id, meta, label });
        } else {
          this.mapEntryValue({ result, key, meta, label, id, propertySchema });
        }
      });

      return result;
    });
  }

  private processNestedObject(
    propertySchema: RecordSchemaEntry,
    value: { id?: string; meta?: UserValueContents['meta']; label?: string },
  ): GeneratedValue {
    const nestedResult: GeneratedValue = {};
    const { id, meta, label } = value;

    Object.keys(propertySchema.properties || {}).forEach(key => {
      const childPropertySchema = propertySchema.properties?.[key];

      this.mapEntryValue({ result: nestedResult, key, meta, label, id, propertySchema: childPropertySchema });
    });

    return nestedResult;
  }

  private mapEntryValue({
    result,
    key,
    meta,
    label,
    id,
    propertySchema,
  }: {
    result: GeneratedValue;
    key: string;
    meta?: UserValueContents['meta'];
    label?: string;
    id?: string;
    propertySchema?: RecordSchemaEntry;
  }) {
    // Determine if the property should be an array based on schema type
    const isArrayType = propertySchema?.type === RecordSchemaEntryType.array;
    let value: string | undefined;

    // Extract the raw value based on property key patterns
    if (meta?.uri && key.includes('link')) {
      value = meta.uri;
    } else if (meta?.basicLabel && (key.includes('term') || key.includes('label') || key.includes('name'))) {
      value = meta.basicLabel;
    } else if (key.includes('code')) {
      value = meta?.uri?.split('/').pop() ?? label ?? '';
    } else if (key.includes('srsId')) {
      const selectedKey = meta?.srsId ? 'srsId' : 'id';

      result[selectedKey] = meta?.srsId ?? id;

      return;
    } else {
      value = label;
    }

    // Format the value according to schema type (array or string)
    if (value) {
      result[key] = isArrayType ? [value] : value;
    } else {
      result[key] = isArrayType ? [] : '';
    }
  }
}
