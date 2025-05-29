import { ValueResult } from '../../types/valueTypes';

export type RecordSchemaEntryProcessingContext = {
  field: RecordSchemaEntry;
  entry: SchemaEntry;
  userValues: UserValues;
};

export interface RecordSchemaEntryProcessor {
  canProcess(field: RecordSchemaEntry): boolean;

  process(RecordSchemaEntryProcessingContext: RecordSchemaEntryProcessingContext): ValueResult;
}
