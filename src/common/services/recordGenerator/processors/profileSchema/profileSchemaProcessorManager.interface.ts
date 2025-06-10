export interface IProfileSchemaProcessorManager {
  process(
    profileSchemaEntry: SchemaEntry,
    recordSchemaEntry: RecordSchemaEntry,
    userValues: UserValues,
  ): Record<string, any> | never[];
}
