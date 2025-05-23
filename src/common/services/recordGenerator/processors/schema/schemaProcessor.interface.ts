export interface ISchemaProcessor {
  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField): boolean;

  process(schemaEntry: SchemaEntry, userValues: UserValues, modelField?: RecordModelField): Record<string, any>;
}
