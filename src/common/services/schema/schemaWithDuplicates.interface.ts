export interface ISchemaWithDuplicates {
  get: () => Schema;

  set: (schema: Schema) => void;

  duplicateEntry: (entry: SchemaEntry, isAutoDuplication?: boolean) => string | undefined;

  deleteEntry: (entry: SchemaEntry) => string[] | undefined;
}
