import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { GeneratedValue, ValueOptions, ValueResult } from '../../types/value.types';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ValueProcessor } from '../value/valueProcessor';
import { RecordSchemaEntryProcessingContext, RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';
import { RecordSchemaEntryManager } from './recordSchemaEntryManager';

export class ObjectEntryProcessor implements RecordSchemaEntryProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly profileSchemaManager: ProfileSchemaManager,
    private readonly recordSchemaEntryManager: RecordSchemaEntryManager,
  ) {}

  canProcess(recordSchemaEntry: RecordSchemaEntry) {
    return recordSchemaEntry.type === RecordSchemaEntryType.object && !!recordSchemaEntry.fields;
  }

  process({ recordSchemaEntry, profileSchemaEntry, userValues }: RecordSchemaEntryProcessingContext) {
    const options: ValueOptions = {
      hiddenWrapper: recordSchemaEntry.options?.hiddenWrapper ?? false,
    };
    const result: GeneratedValue = {};

    if (!recordSchemaEntry.fields) {
      return this.valueProcessor.processSchemaValues({}, options);
    }

    const parentPath = profileSchemaEntry ? profileSchemaEntry.path : undefined;

    for (const [key, childField] of Object.entries(recordSchemaEntry.fields)) {
      this.processObjectField(key, childField, result, parentPath, userValues);
    }

    return this.valueProcessor.processSchemaValues(result, options);
  }

  private processObjectField(
    key: string,
    recordSchemaEntry: RecordSchemaEntry,
    result: GeneratedValue,
    parentPath: string[] | undefined,
    userValues: UserValues,
  ) {
    const localParentPath = parentPath ? [...parentPath] : undefined;
    const childEntries = this.profileSchemaManager.findSchemaEntriesByUriBFLite(key, localParentPath);

    for (const childEntry of childEntries) {
      const childResult = this.recordSchemaEntryManager.processEntry({
        recordSchemaEntry,
        userValues,
        profileSchemaEntry: childEntry,
      });

      if (!childResult.value) continue;

      if (recordSchemaEntry.type === RecordSchemaEntryType.array) {
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
