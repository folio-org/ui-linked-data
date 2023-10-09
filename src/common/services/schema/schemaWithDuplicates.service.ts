import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export class SchemaWithDuplicatesService {
  constructor(private schema: Map<string, SchemaEntry>, private selectedEntries: ISelectedEntries) {
    this.schema = _.cloneDeep(this.schema);
  }

  get() {
    return this.schema;
  }

  duplicateEntry(entry: SchemaEntry) {
    const { uuid, path, children } = entry;
    const updatedEntryUuid = uuidv4();
    const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid);
    updatedEntry.children = this.getUpdatedChildren(children);

    const parentEntryUuid = path[path.length - 2];
    const parentEntry = this.schema.get(parentEntryUuid);

    // update parent entry
    const updatedParentEntry = this.getUpdatedParentEntry({
      parentEntry,
      originalEntryUuid: uuid,
      updatedEntryUuid: updatedEntryUuid,
    });

    if (updatedParentEntry) {
      this.schema.set(parentEntryUuid, updatedParentEntry);
      this.schema.set(updatedEntryUuid, updatedEntry);
    }
  }

  private getCopiedEntry(entry: SchemaEntry, uuid: string) {
    const { path } = entry;
    const copiedEntry = _.cloneDeep(entry);

    copiedEntry.uuid = uuid;
    copiedEntry.path = this.getUpdatedPath(path, uuid);

    return copiedEntry;
  }

  private getUpdatedChildren(children: string[] | undefined) {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = this.schema.get(entryUuid);

      if (!entry) return;

      const { children } = entry;
      const updatedEntryUuid = uuidv4();
      const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid);

      updatedEntry.children = this.getUpdatedChildren(children);

      this.schema.set(updatedEntryUuid, updatedEntry);

      updatedChildren.push(updatedEntryUuid);

      this.selectedEntries.addDuplicated(entry.uuid, updatedEntryUuid);
    });

    return updatedChildren;
  }

  private getUpdatedParentEntry({
    parentEntry,
    originalEntryUuid,
    updatedEntryUuid,
  }: {
    parentEntry?: SchemaEntry;
    originalEntryUuid: string;
    updatedEntryUuid: string;
  }) {
    if (!parentEntry) return;

    const updatedParentEntry = _.cloneDeep(parentEntry);
    const { children, path } = updatedParentEntry;
    const originalEntryIndex = children?.indexOf(originalEntryUuid);

    if (originalEntryIndex) {
      // Add the UUID of the copied entry to the parent element's array of children,
      // saving the order of the elements
      children?.splice(originalEntryIndex + 1, 0, updatedEntryUuid);
      updatedParentEntry.path = this.getUpdatedPath(path, updatedEntryUuid);
    }

    return updatedParentEntry;
  }

  private getUpdatedPath(path: string[], uuid: string) {
    const updatedPath = [...path];
    updatedPath[path.length - 1] = uuid;

    return updatedPath;
  }
}
