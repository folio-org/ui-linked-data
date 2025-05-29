import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ValueOptions } from '../../types/valueTypes';
import { ValueProcessor } from '../value/valueProcessor';
import { RecordSchemaEntryProcessingContext, RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';

export class SimpleEntryProcessor implements RecordSchemaEntryProcessor {
  constructor(private readonly valueProcessor: ValueProcessor) {}

  canProcess(recordSchemaEntry: RecordSchemaEntry) {
    return (
      recordSchemaEntry.type !== RecordSchemaEntryType.array && recordSchemaEntry.type !== RecordSchemaEntryType.object
    );
  }

  process({ recordSchemaEntry, profileSchemaEntry, userValues }: RecordSchemaEntryProcessingContext) {
    const options: ValueOptions = {
      hiddenWrapper: recordSchemaEntry.options?.hiddenWrapper ?? false,
    };
    const values: UserValueContents[] = userValues[profileSchemaEntry.uuid]?.contents || [];

    return this.valueProcessor.process(values, options);
  }
}
