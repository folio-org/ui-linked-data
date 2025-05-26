import { RecordModelType } from '@common/constants/recordModel.constants';
import { ValueOptions } from '../../types/valueTypes';
import { SchemaProcessorManager } from '../schema/schemaProcessorManager';
import { ValueProcessor } from '../value/valueProcessor';
import { ModelFieldProcessor } from './modelFieldProcessor.interface';

export class ArrayFieldProcessor implements ModelFieldProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly schemaProcessorManager: SchemaProcessorManager,
  ) {}

  canProcess(field: RecordModelField) {
    return field.type === RecordModelType.array;
  }

  process(field: RecordModelField, entry: SchemaEntry, userValues: UserValues) {
    const options: ValueOptions = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };

    const values = userValues[entry.uuid]?.contents || [];

    // Handle string array type
    if (field.value === RecordModelType.string) {
      return {
        value: this.valueProcessor.processSimpleValues(values),
        options,
      };
    }

    // Try processor-based handling
    const processorValue = this.schemaProcessorManager.process(entry, field, userValues);

    if (Object.keys(processorValue).length > 0) {
      return this.valueProcessor.processSchemaValues(processorValue, options);
    }

    return { value: null, options };
  }
}
