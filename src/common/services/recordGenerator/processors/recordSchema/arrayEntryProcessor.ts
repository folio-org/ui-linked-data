import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { ensureArray } from '@/common/helpers/common.helper';

import { ProcessContext } from '../../types/common.types';
import { SchemaPropertyValue, ValueOptions, ValueResult } from '../../types/value.types';
import { IProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager.interface';
import { IValueProcessor, SchemaValue } from '../value/valueProcessor.interface';
import { IRecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';

export class ArrayEntryProcessor implements IRecordSchemaEntryProcessor {
  constructor(
    private readonly valueProcessor: IValueProcessor,
    private readonly profileSchemaProcessorManager: IProfileSchemaProcessorManager,
  ) {}

  canProcess(property: RecordSchemaEntry) {
    return property.type === RecordSchemaEntryType.array;
  }

  process(data: ProcessContext) {
    if (!data.profileSchemaEntry.type) {
      return { value: null, options: {} };
    }

    const processingResult = this.processArrayEntry(data);

    return this.applyValueContainer(processingResult, data.recordSchemaEntry.options?.valueContainer);
  }

  private processArrayEntry({ recordSchemaEntry, profileSchemaEntry, userValues, selectedEntries }: ProcessContext) {
    const options = {
      hiddenWrapper: recordSchemaEntry.options?.hiddenWrapper ?? false,
    };

    return recordSchemaEntry.value === RecordSchemaEntryType.string
      ? this.processStringArrayValues(profileSchemaEntry, userValues, options)
      : this.processSchemaArrayValues(profileSchemaEntry, recordSchemaEntry, userValues, selectedEntries, options);
  }

  private processStringArrayValues(profileSchemaEntry: SchemaEntry, userValues: UserValues, options: ValueOptions) {
    const values = userValues[profileSchemaEntry.uuid]?.contents;

    return this.valueProcessor.process(values, options);
  }

  private processSchemaArrayValues(
    profileSchemaEntry: SchemaEntry,
    recordSchemaEntry: RecordSchemaEntry,
    userValues: UserValues,
    selectedEntries: string[],
    options: ValueOptions,
  ): ValueResult {
    const processedValues = this.profileSchemaProcessorManager.process({
      profileSchemaEntry,
      recordSchemaEntry,
      userValues,
      selectedEntries,
    });

    const result = this.valueProcessor.processSchemaValues(processedValues as Record<string, SchemaValue>, options);

    // Transform the result to match ValueResult type
    return {
      value: result.value as unknown as SchemaPropertyValue,
      options: result.options,
    };
  }

  private applyValueContainer(result: ValueResult, container?: { property: string; type?: 'array' | 'object' }) {
    if (!container || !result.value) {
      return result;
    }

    const { property: containerProperty, type = 'array' } = container;
    const arrayValues = ensureArray(result.value as SchemaPropertyValue | SchemaPropertyValue[]);
    const wrappedValues = arrayValues.map((value: SchemaPropertyValue) => ({
      [containerProperty]: type === 'array' ? [value] : value,
    }));

    return {
      value: wrappedValues,
      options: result.options,
    };
  }
}
