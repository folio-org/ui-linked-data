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

    Object.entries(recordSchemaEntry.fields).forEach(([key, childField]) => {
      this.processObjectField(key, childField, result, parentPath, userValues);
    });

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

    childEntries.forEach(childEntry => {
      const childResult = this.recordSchemaEntryManager.processEntry({
        recordSchemaEntry,
        userValues,
        profileSchemaEntry: childEntry,
      });

      if (!childResult.value) return;

      if (recordSchemaEntry.type === RecordSchemaEntryType.array) {
        this.processArrayField(key, childResult, result);
      } else {
        result[key] = childResult.value;
      }
    });
  }

  private processArrayField(key: string, childResult: ValueResult, result: GeneratedValue) {
    if (childResult.options.hiddenWrapper) {
      this.processHiddenWrapperArray(result, childResult);
    } else {
      this.processRegularArray(key, result, childResult);
    }
  }

  private processHiddenWrapperArray(result: GeneratedValue, childResult: ValueResult) {
    const firstValue = this.getFirstArrayValue(childResult.value);

    if (!firstValue || typeof firstValue !== 'object') return;

    Object.entries(firstValue as Record<string, unknown>).forEach(([key, value]) => {
      this.mergeValueIntoResult(result, key, value as GeneratedValue[keyof GeneratedValue]);
    });
  }

  private getFirstArrayValue(value: unknown) {
    return Array.isArray(value) ? value[0] : null;
  }

  private mergeValueIntoResult(result: GeneratedValue, key: string, value: GeneratedValue[keyof GeneratedValue]) {
    if (!(key in result)) {
      result[key] = value;

      return;
    }

    const existingValue = result[key];

    if (Array.isArray(existingValue) && Array.isArray(value)) {
      result[key] = [...existingValue, ...value];
    } else if (typeof existingValue === 'object' && typeof value === 'object') {
      result[key] = { ...existingValue, ...value };
    } else {
      result[key] = value;
    }
  }

  private processRegularArray(key: string, result: GeneratedValue, childResult: ValueResult) {
    result[key] = result[key] ?? [];
    const existingValue = result[key];

    if (!Array.isArray(existingValue)) return;

    if (Array.isArray(childResult.value)) {
      result[key] = [...existingValue, ...childResult.value];
    } else if (childResult.value !== null) {
      result[key] = [...existingValue, childResult.value];
    }
  }
}
