import { ProcessContext } from '../../types/common.types';
import { ValueResult } from '../../types/value.types';

export interface IRecordSchemaEntryProcessor {
  canProcess(recordSchemaEntry: RecordSchemaEntry): boolean;

  process(recordSchemaEntryProcessingContext: ProcessContext): ValueResult;
}
