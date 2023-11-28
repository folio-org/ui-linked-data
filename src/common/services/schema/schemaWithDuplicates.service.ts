import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';

export class SchemaWithDuplicatesService {
  constructor(private schema: Map<string, SchemaEntry>, private selectedEntriesService: ISelectedEntries) {
    this.schema = cloneDeep(schema);
  }

  get() {
    return this.schema;
  }

  duplicateEntry(entry: SchemaEntry) {
    const { uuid, path, children, constraints } = entry;

    if (!constraints?.repeatable) return;

    const updatedEntryUuid = uuidv4();
    const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid);
    updatedEntry.children = this.getUpdatedChildren(children, updatedEntry.path);

    // the path contains the UUID of the parent element and the UUID of the current entry,
    // so the UUID of the parent element is second from the end
    const parentEntryUuid = path[path.length - 2];
    const parentEntry = this.schema.get(parentEntryUuid);
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

  private getCopiedEntry(entry: SchemaEntry, uuid: string, parentElemPath?: string[]) {
    const { path } = entry;
    const copiedEntry = cloneDeep(entry);

    copiedEntry.uuid = uuid;
    copiedEntry.path = this.getUpdatedPath(path, uuid, parentElemPath);

    return copiedEntry;
  }

  private getUpdatedChildren(children: string[] | undefined, parentElemPath?: string[]) {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = this.schema.get(entryUuid);

      if (!entry) return;

      const { children } = entry;
      const updatedEntryUuid = uuidv4();
      const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid, parentElemPath);
      updatedEntry.children = this.getUpdatedChildren(children, updatedEntry.path);

      this.schema.set(updatedEntryUuid, updatedEntry);
      this.selectedEntriesService.addDuplicated(entry.uuid, updatedEntryUuid);

      updatedChildren.push(updatedEntryUuid);
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

    const updatedParentEntry = cloneDeep(parentEntry);
    const { children } = updatedParentEntry;
    const originalEntryIndex = children?.indexOf(originalEntryUuid);

    if (originalEntryIndex !== undefined && originalEntryIndex >= 0) {
      // Add the UUID of the copied entry to the parent element's array of children,
      // saving the order of the elements
      children?.splice(originalEntryIndex + 1, 0, updatedEntryUuid);
    }

    return updatedParentEntry;
  }

  private getUpdatedPath(path: string[], uuid: string, parentElemPath?: string[]) {
    const updatedPath = parentElemPath ? [...parentElemPath] : [...path];
    updatedPath[path.length - 1] = uuid;

    return updatedPath;
  }
}
