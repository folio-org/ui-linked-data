export interface ISchemaWithDuplicates {
  get: () => Schema;

  set: (schema: Schema) => void;

  duplicateEntry: (entry: SchemaEntry, isManualDuplication?: boolean) => string | undefined;

  deleteEntry: (entry: SchemaEntry) => string[] | undefined;
}
