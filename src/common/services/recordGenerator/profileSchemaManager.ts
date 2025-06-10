import { IProfileSchemaManager } from './profileSchemaManager.interface';

export class ProfileSchemaManager implements IProfileSchemaManager {
  private schema: Schema;
  private cachedSchemaValues: SchemaEntry[] | null;
  private uriBFLiteIndex: Map<string, SchemaEntry[]> | null;

  constructor() {
    this.schema = new Map();
    this.cachedSchemaValues = null;
    this.uriBFLiteIndex = null;
  }

  init(schema: Schema) {
    this.schema = schema;
    this.cachedSchemaValues = null;
    this.uriBFLiteIndex = null;
  }

  getSchema() {
    return this.schema;
  }

  findSchemaEntriesByUriBFLite(uriBFLite: string, parentPath?: string[]) {
    if (this.uriBFLiteIndex === null) {
      this.buildUriBFLiteIndex();
    }

    const entries = this.uriBFLiteIndex?.get(uriBFLite) || [];

    if (parentPath && parentPath.length > 0) {
      return entries.filter(entry => {
        if (entry.path.length < parentPath.length) return false;

        for (let i = 0; i < parentPath.length; i++) {
          if (entry.path[i] !== parentPath[i]) return false;
        }

        return true;
      });
    }

    return entries;
  }

  getSchemaEntry(uuid: string) {
    return this.schema.get(uuid);
  }

  hasOptionValues(optionEntry: SchemaEntry, userValues: UserValues) {
    return !!optionEntry.children?.some(childUuid => {
      const childEntry = this.schema.get(childUuid);

      return !!childEntry && !!userValues[childEntry.uuid]?.contents?.length;
    });
  }

  private buildUriBFLiteIndex() {
    this.uriBFLiteIndex = new Map();

    this.cachedSchemaValues ??= Array.from(this.schema.values());

    for (const entry of this.cachedSchemaValues) {
      if (!entry.uriBFLite) continue;

      const currentEntries = this.uriBFLiteIndex.get(entry.uriBFLite);

      if (currentEntries) {
        currentEntries.push(entry);
      } else {
        this.uriBFLiteIndex.set(entry.uriBFLite, [entry]);
      }
    }
  }
}
