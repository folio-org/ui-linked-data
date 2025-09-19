export interface IMarcMappingGenerator {
  applyMarcMappingToEntries(schema: Map<string, SchemaEntry>): void;
}
