import { RecordModelType } from '@common/constants/recordModel.constants';
import { ValueOptions, ValueResult, SchemaFieldValue } from '../../types/valueTypes';
import { SchemaProcessorManager } from '../schema/schemaProcessorManager';
import { ValueProcessor } from '../value/valueProcessor';
import { ModelFieldProcessingContext, ModelFieldProcessor } from './modelFieldProcessor.interface';

export class ArrayFieldProcessor implements ModelFieldProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly schemaProcessorManager: SchemaProcessorManager,
  ) {}

  canProcess(field: RecordModelField): boolean {
    return field.type === RecordModelType.array;
  }

  process({ field, entry, userValues }: ModelFieldProcessingContext): ValueResult {
    if (!entry.type) {
      return { value: null, options: {} };
    }

    const processingResult = this.processArrayField(field as RecordModelField, entry, userValues);

    return this.applyValueContainer(processingResult, field.options?.valueContainer);
  }

  private processArrayField(
    field: RecordModelField,
    entry: ModelFieldProcessingContext['entry'],
    userValues: UserValues,
  ): ValueResult {
    const options = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };

    return field.value === RecordModelType.string
      ? this.processStringArrayValues(entry, userValues, options)
      : this.processSchemaArrayValues(entry, field, userValues, options);
  }

  private processStringArrayValues(
    entry: ModelFieldProcessingContext['entry'],
    userValues: UserValues,
    options: ValueOptions,
  ): ValueResult {
    const values = userValues[entry.uuid]?.contents;

    return this.valueProcessor.process(values, options);
  }

  private processSchemaArrayValues(
    entry: ModelFieldProcessingContext['entry'],
    field: RecordModelField,
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
