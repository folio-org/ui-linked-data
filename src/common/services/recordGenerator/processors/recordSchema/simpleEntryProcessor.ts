import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ValueOptions } from '../../types/value.types';
import { IValueProcessor } from '../value/valueProcessor.interface';
import { IRecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';
import { ProcessContext } from '../../types/common.types';

export class SimpleEntryProcessor implements IRecordSchemaEntryProcessor {
  constructor(private readonly valueProcessor: IValueProcessor) {}

  canProcess(recordSchemaEntry: RecordSchemaEntry) {
    return (
      recordSchemaEntry.type !== RecordSchemaEntryType.array && recordSchemaEntry.type !== RecordSchemaEntryType.object
    );
  }

  process({ recordSchemaEntry, profileSchemaEntry, userValues }: ProcessContext) {
    const options: ValueOptions = {
      hiddenWrapper: recordSchemaEntry.options?.hiddenWrapper ?? false,
    };
    const values: UserValueContents[] = userValues[profileSchemaEntry.uuid]?.contents || [];

    return this.valueProcessor.process(values, options);
  }
}
