import { RecordModelType } from '@common/constants/recordModel.constants';
import { ValueOptions } from '../../types/valueTypes';
import { ValueProcessor } from '../value/valueProcessor';
import { ModelFieldProcessor } from './modelFieldProcessor.interface';

export class SimpleFieldProcessor implements ModelFieldProcessor {
  constructor(private readonly valueProcessor: ValueProcessor) {}

  canProcess(field: RecordModelField) {
    return field.type !== RecordModelType.array && field.type !== RecordModelType.object;
  }

  process(field: RecordModelField, entry: SchemaEntry, userValues: UserValues) {
    const options: ValueOptions = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };
    const values = userValues[entry.uuid]?.contents || [];

    return this.valueProcessor.process(values, options);
  }
}
