import { ProcessContext } from '../../types/common.types';
import { ValueResult } from '../../types/value.types';

export interface IRecordSchemaEntryManager {
  processEntry(data: ProcessContext): ValueResult;
}
