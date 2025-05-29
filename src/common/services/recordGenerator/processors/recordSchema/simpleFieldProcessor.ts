import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ValueOptions } from '../../types/valueTypes';
import { ValueProcessor } from '../value/valueProcessor';
import { RecordSchemaEntryProcessingContext, RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';

export class SimpleFieldProcessor implements RecordSchemaEntryProcessor {
  constructor(private readonly valueProcessor: ValueProcessor) {}

  canProcess(field: RecordSchemaEntry) {
    return field.type !== RecordSchemaEntryType.array && field.type !== RecordSchemaEntryType.object;
  }

  process({ field, entry, userValues }: RecordSchemaEntryProcessingContext) {
    const options: ValueOptions = {
      hiddenWrapper: field.options?.hiddenWrapper ?? false,
    };
    const values: UserValueContents[] = userValues[entry.uuid]?.contents || [];

    return this.valueProcessor.process(values, options);
  }
}
