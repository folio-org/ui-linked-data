export interface ISchemaWithDuplicates {
  get: () => Schema;

  set: (schema: Schema) => void;

  duplicateEntry: (entry: SchemaEntry, isAutoDuplication?: boolean) => Promise<string | undefined>;

  deleteEntry: (entry: SchemaEntry) => string[] | undefined;
}
