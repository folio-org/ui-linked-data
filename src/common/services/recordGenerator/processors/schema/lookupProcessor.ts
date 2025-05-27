import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordModelType } from '@common/constants/recordModel.constants';
import { GeneratedValue } from '../../types/valueTypes';
import { ISchemaProcessor } from './schemaProcessor.interface';

export class LookupProcessor implements ISchemaProcessor {
  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField) {
    return (
      modelField.type === RecordModelType.array &&
      modelField.value === RecordModelType.object &&
      (schemaEntry.type === AdvancedFieldType.complex || schemaEntry.type === AdvancedFieldType.simple)
    );
  }

  process(schemaEntry: SchemaEntry, userValues: UserValues, modelField: RecordModelField) {
    const values = userValues[schemaEntry.uuid]?.contents || [];

    return this.processLookupValues(modelField, values);
  }

  private processLookupValues(modelField: RecordModelField, values: UserValueContents[]) {
    if (!modelField.fields || values.length === 0) {
      return [];
    }

    return values.map(({ meta, label }) => {
      const result: GeneratedValue = {};

      for (const key of Object.keys(modelField.fields || {})) {
        this.mapFieldValue(result, key, meta, label);
      }

      return result;
    });
  }

  private mapFieldValue(
    result: GeneratedValue,
    key: string,
    meta: UserValueContents['meta'] | undefined,
    label?: string,
  ) {
    if (meta?.uri && key.includes('link')) {
      result[key] = [meta.uri];
    } else if (meta?.basicLabel && key.includes('term')) {
      result[key] = [meta.basicLabel];
    } else if (key.includes('code')) {
      result[key] = [meta?.uri?.split('/').pop() ?? label ?? ''];
    } else {
      result[key] = label ? [label] : [];
    }
  }
}
