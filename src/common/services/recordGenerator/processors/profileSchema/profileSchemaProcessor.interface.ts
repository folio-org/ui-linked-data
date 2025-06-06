export interface IProfileSchemaProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry): boolean;

  process(
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
    recordSchemaEntry?: RecordSchemaEntry,
  ): Record<string, any>;
}
