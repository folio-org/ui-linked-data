import { RecordModelType } from '@common/constants/recordModel.constants';
import { ValueOptions } from '../../types/valueTypes';
import { SchemaProcessorManager } from '../schema/schemaProcessorManager';
import { ValueProcessor } from '../value/valueProcessor';
import { ModelFieldProcessingContext, ModelFieldProcessor } from './modelFieldProcessor.interface';

export class ArrayFieldProcessor implements ModelFieldProcessor {
  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly schemaProcessorManager: SchemaProcessorManager,
  ) {}

  canProcess(field: RecordModelField) {
    return field.type === RecordModelType.array;
  }

  process({ field, entry, userValues }: ModelFieldProcessingContext) {
    const options: ValueOptions = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };
    const values = userValues[entry.uuid]?.contents || [];

    if (field.value === RecordModelType.string) {
      return this.valueProcessor.process(values, options);
    }

    const processorValue = this.schemaProcessorManager.process(entry, field, userValues);

    return this.valueProcessor.processSchemaValues(processorValue, options);
  }
}
