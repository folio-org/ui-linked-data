import { ValueResult } from '../../types/value.types';

export type RecordSchemaEntryProcessingContext = {
  recordSchemaEntry: RecordSchemaEntry;
  profileSchemaEntry: SchemaEntry;
  userValues: UserValues;
};

export interface RecordSchemaEntryProcessor {
  canProcess(recordSchemaEntry: RecordSchemaEntry): boolean;

  process(recordSchemaEntryProcessingContext: RecordSchemaEntryProcessingContext): ValueResult;
}
