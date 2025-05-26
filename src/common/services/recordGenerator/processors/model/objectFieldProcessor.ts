import { RecordModelType } from '@common/constants/recordModel.constants';
import { GeneratedValue, ValueOptions, ValueResult } from '../../types/valueTypes';
import { SchemaManager } from '../../schemaManager';
import { ModelFieldProcessor } from './modelFieldProcessor.interface';
import { ModelFieldManager } from './modelFieldManager';

export class ObjectFieldProcessor implements ModelFieldProcessor {
  constructor(
    private readonly schemaManager: SchemaManager,
    private readonly modelFieldManager: ModelFieldManager,
  ) {}

  canProcess(field: RecordModelField) {
    return field.type === RecordModelType.object && !!field.fields;
  }

  process(field: RecordModelField, entry: SchemaEntry, userValues: UserValues) {
    const options: ValueOptions = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };
    const result: GeneratedValue = {};

    if (!field.fields) return { value: null, options };

    const parentPath = entry ? entry.path : undefined;

    for (const [key, childField] of Object.entries(field.fields)) {
      this.processObjectField(key, childField, result, parentPath, userValues);
    }

    return {
      value: Object.keys(result).length > 0 ? result : null,
      options,
    };
  }

  private processObjectField(
    key: string,
    field: RecordModelField,
    result: GeneratedValue,
    parentPath: string[] | undefined,
    userValues: UserValues,
  ) {
    const localParentPath = parentPath ? [...parentPath] : undefined;
    const childEntries = this.schemaManager.findSchemaEntriesByUriBFLite(key, localParentPath);

    for (const childEntry of childEntries) {
      // Find the appropriate processor for this field type
      const childResult = this.modelFieldManager.processField(field, childEntry, userValues);

      if (!childResult.value) continue;

      if (field.type === RecordModelType.array) {
        this.processArrayField(key, childResult, result);
      } else {
        result[key] = childResult.value;
      }
    }
  }

  private processArrayField(key: string, childResult: ValueResult, result: GeneratedValue) {
    if (childResult.options.hiddenWrapper) {
      const firstValue = Array.isArray(childResult.value) ? childResult.value[0] : null;

      if (firstValue && typeof firstValue === 'object') {
        Object.assign(result, firstValue);
      }
    } else {
      result[key] = result[key] ?? [];

      const existingValue = result[key];

      if (Array.isArray(existingValue)) {
        if (Array.isArray(childResult.value)) {
          result[key] = [...existingValue, ...childResult.value];
        } else if (childResult.value !== null) {
          result[key] = [...existingValue, childResult.value];
        }
      }
    }
  }
}
