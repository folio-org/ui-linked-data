import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ValueOptions, ValueResult, SchemaFieldValue } from '../../types/value.types';
import { ProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager';
import { ValueProcessor } from '../value/valueProcessor';
import { RecordSchemaEntryProcessingContext, RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';

export class ArrayEntryProcessor implements RecordSchemaEntryProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly profileSchemaProcessorManager: ProfileSchemaProcessorManager,
  ) {}

  canProcess(field: RecordSchemaEntry) {
    return field.type === RecordSchemaEntryType.array;
  }

  process({ recordSchemaEntry, profileSchemaEntry, userValues }: RecordSchemaEntryProcessingContext) {
    if (!profileSchemaEntry.type) {
      return { value: null, options: {} };
    }

    const processingResult = this.processArrayField(recordSchemaEntry, profileSchemaEntry, userValues);

    return this.applyValueContainer(processingResult, recordSchemaEntry.options?.valueContainer);
  }

  private processArrayField(
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

  private processStringArrayValues(
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
    options: ValueOptions,
  ) {
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

  private applyValueContainer(result: ValueResult, container?: { field: string; type?: 'array' | 'object' }) {
    if (!container || !result.value) {
      return result;
    }

    const { field: containerField, type = 'array' } = container;
    const arrayValues = Array.isArray(result.value) ? result.value : [result.value];
    const wrappedValues = arrayValues.map((value: SchemaFieldValue) => ({
      [containerField]: type === 'array' ? [value] : value,
    }));

    return {
      value: wrappedValues,
      options: result.options,
    };
  }
}
