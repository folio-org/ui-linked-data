export interface IProfileSchemaManager {
  init(schema: Schema): void;

  getSchema(): Schema;

  findSchemaEntriesByUriBFLite(uriBFLite: string, parentPath?: string[]): SchemaEntry[];

  getSchemaEntry(uuid: string): SchemaEntry | undefined;

  hasOptionValues(optionEntry: SchemaEntry, userValues: UserValues): boolean;
}
