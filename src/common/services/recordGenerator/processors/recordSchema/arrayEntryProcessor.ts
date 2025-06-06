import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ValueOptions, ValueResult, SchemaPropertyValue } from '../../types/value.types';
import { ProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager';
import { ValueProcessor } from '../value/valueProcessor';
import { RecordSchemaEntryProcessingContext, RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';

export class ArrayEntryProcessor implements RecordSchemaEntryProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly profileSchemaProcessorManager: ProfileSchemaProcessorManager,
  ) {}

  canProcess(property: RecordSchemaEntry) {
    return property.type === RecordSchemaEntryType.array;
  }

  process({ recordSchemaEntry, profileSchemaEntry, userValues }: RecordSchemaEntryProcessingContext) {
    if (!profileSchemaEntry.type) {
      return { value: null, options: {} };
    }

    const processingResult = this.processArrayEntry(recordSchemaEntry, profileSchemaEntry, userValues);

    return this.applyValueContainer(processingResult, recordSchemaEntry.options?.valueContainer);
  }

  private processArrayEntry(
    recordSchemaEntry: RecordSchemaEntry,
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
  ) {
    const options = {
      hiddenWrapper: recordSchemaEntry.options?.hiddenWrapper ?? false,
    };

    return recordSchemaEntry.value === RecordSchemaEntryType.string
      ? this.processStringArrayValues(profileSchemaEntry, userValues, options)
      : this.processSchemaArrayValues(profileSchemaEntry, recordSchemaEntry, userValues, options);
  }

  private processStringArrayValues(profileSchemaEntry: SchemaEntry, userValues: UserValues, options: ValueOptions) {
    const values = userValues[profileSchemaEntry.uuid]?.contents;

    return this.valueProcessor.process(values, options);
  }

  private processSchemaArrayValues(
    profileSchemaEntry: SchemaEntry,
    recordSchemaEntry: RecordSchemaEntry,
    userValues: UserValues,
    options: ValueOptions,
  ) {
    const processedValues = this.profileSchemaProcessorManager.process(
      profileSchemaEntry,
      recordSchemaEntry,
      userValues,
    );

    return this.valueProcessor.processSchemaValues(processedValues, options);
  }

  private applyValueContainer(result: ValueResult, container?: { property: string; type?: 'array' | 'object' }) {
    if (!container || !result.value) {
      return result;
    }

    const { property: containerProperty, type = 'array' } = container;
    const arrayValues = Array.isArray(result.value) ? result.value : [result.value];
    const wrappedValues = arrayValues.map((value: SchemaPropertyValue) => ({
      [containerProperty]: type === 'array' ? [value] : value,
    }));

    return {
      value: wrappedValues,
      options: result.options,
    };
  }
}
