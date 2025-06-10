import { ValueResult } from '../../types/value.types';

export interface IProcessEntryProps {
  recordSchemaEntry: RecordSchemaEntry;
  profileSchemaEntry: SchemaEntry;
  userValues: UserValues;
}

export interface IRecordSchemaEntryManager {
  processEntry({ recordSchemaEntry, profileSchemaEntry, userValues }: IProcessEntryProps): ValueResult;
}
