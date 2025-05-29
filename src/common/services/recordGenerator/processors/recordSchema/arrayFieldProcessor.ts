import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ValueOptions, ValueResult, SchemaFieldValue } from '../../types/valueTypes';
import { ProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager';
import { ValueProcessor } from '../value/valueProcessor';
import { RecordSchemaEntryProcessingContext, RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';

export class ArrayFieldProcessor implements RecordSchemaEntryProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly schemaProcessorManager: ProfileSchemaProcessorManager,
  ) {}

  canProcess(field: RecordSchemaEntry): boolean {
    return field.type === RecordSchemaEntryType.array;
  }

  process({ field, entry, userValues }: RecordSchemaEntryProcessingContext): ValueResult {
    if (!entry.type) {
      return { value: null, options: {} };
    }

    const processingResult = this.processArrayField(field, entry, userValues);

    return this.applyValueContainer(processingResult, field.options?.valueContainer);
  }

  private processArrayField(
    field: RecordSchemaEntry,
    entry: RecordSchemaEntryProcessingContext['entry'],
    userValues: UserValues,
  ): ValueResult {
    const options = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };

    return field.value === RecordSchemaEntryType.string
      ? this.processStringArrayValues(entry, userValues, options)
      : this.processSchemaArrayValues(entry, field, userValues, options);
  }

  private processStringArrayValues(
    entry: RecordSchemaEntryProcessingContext['entry'],
    userValues: UserValues,
    options: ValueOptions,
  ): ValueResult {
    const values = userValues[entry.uuid]?.contents;

    return this.valueProcessor.process(values, options);
  }

  private processSchemaArrayValues(
    entry: RecordSchemaEntryProcessingContext['entry'],
    field: RecordSchemaEntry,
    userValues: UserValues,
    options: ValueOptions,
  ): ValueResult {
    const processedValues = this.schemaProcessorManager.process(entry, field, userValues);

    return this.valueProcessor.processSchemaValues(processedValues, options);
  }

  private applyValueContainer(
    result: ValueResult,
    container?: { field: string; type?: 'array' | 'object' },
  ): ValueResult {
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
