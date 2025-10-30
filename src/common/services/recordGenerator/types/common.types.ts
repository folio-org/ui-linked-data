export interface ProcessContext {
  profileSchemaEntry: SchemaEntry;
  userValues: UserValues;
  selectedEntries: string[];
  recordSchemaEntry: RecordSchemaEntry;
}

export interface LinkedPropertyInfo {
  hasLink: boolean;
  linkedProperty?: string;
  recordSchemaProperty?: RecordSchemaEntry;
}
