export interface ISchemaProcessor {
  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField): boolean;

  process(schemaEntry: SchemaEntry, userValues: UserValues): Record<string, any>;
}
