import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { GeneratedValue, ValueOptions, ValueResult, SchemaPropertyValue } from '../../types/value.types';
import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { IValueProcessor, SchemaValue } from '../value/valueProcessor.interface';
import { IRecordSchemaEntryManager } from './recordSchemaEntryManager.interface';
import { IRecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';
import { ProcessContext } from '../../types/common.types';

export class ObjectEntryProcessor implements IRecordSchemaEntryProcessor {
  constructor(
    private readonly valueProcessor: IValueProcessor,
    private readonly profileSchemaManager: IProfileSchemaManager,
    private readonly recordSchemaEntryManager: IRecordSchemaEntryManager,
  ) {}

  canProcess(recordSchemaEntry: RecordSchemaEntry) {
    return recordSchemaEntry.type === RecordSchemaEntryType.object && !!recordSchemaEntry.properties;
  }

  process({ recordSchemaEntry, profileSchemaEntry, userValues, selectedEntries }: ProcessContext): ValueResult {
    const options: ValueOptions = {
      hiddenWrapper: recordSchemaEntry.options?.hiddenWrapper ?? false,
    };
    const result: GeneratedValue = {};

    if (!recordSchemaEntry.properties) {
      const result = this.valueProcessor.processSchemaValues({}, options);

      // Transform the result to match ValueResult type
      return {
        value: result.value as unknown as SchemaPropertyValue,
        options: result.options,
      };
    }

    const parentPath = profileSchemaEntry ? profileSchemaEntry.path : undefined;

    Object.entries(recordSchemaEntry.properties).forEach(([key, childProperty]) => {
      this.processObjectProperty(key, childProperty, result, parentPath, userValues, selectedEntries);
    });

    const processedResult = this.valueProcessor.processSchemaValues(
      result as unknown as Record<string, SchemaValue>,
      options,
    );

    // Transform the result to match ValueResult type
    return {
      value: processedResult.value as unknown as SchemaPropertyValue,
      options: processedResult.options,
    };
  }

  private processObjectProperty(
    key: string,
    recordSchemaEntry: RecordSchemaEntry,
    result: GeneratedValue,
    parentPath: string[] | undefined,
    userValues: UserValues,
    selectedEntries: string[],
  ) {
    const localParentPath = parentPath ? [...parentPath] : undefined;
    const childEntries = this.profileSchemaManager.findSchemaEntriesByUriBFLite(key, localParentPath);

    childEntries.forEach(childEntry => {
      const childResult = this.recordSchemaEntryManager.processEntry({
        recordSchemaEntry,
        userValues,
        profileSchemaEntry: childEntry,
        selectedEntries,
      });

      if (!childResult.value) return;

      if (recordSchemaEntry.type === RecordSchemaEntryType.array) {
        this.processArrayEntry(key, childResult, result);
      } else {
        result[key] = childResult.value;
      }
    });
  }

  private processArrayEntry(key: string, childResult: ValueResult, result: GeneratedValue) {
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
