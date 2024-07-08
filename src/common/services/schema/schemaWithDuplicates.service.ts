import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';

export class SchemaWithDuplicatesService {
  private isManualDuplication: boolean;

  constructor(
    private schema: Map<string, SchemaEntry>,
    private selectedEntriesService: ISelectedEntries,
  ) {
    this.schema = cloneDeep(schema);
    this.isManualDuplication = true;
  }

  get() {
    return this.schema;
  }

  duplicateEntry(entry: SchemaEntry, isManualDuplication = true) {
    this.isManualDuplication = isManualDuplication;
    const { uuid, path, children, constraints, clonedBy, cloneOf } = entry;

    if (!constraints?.repeatable) return;

    const updatedEntryUuid = uuidv4();
    const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid, undefined, true);
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

      if (this.isManualDuplication && cloneOf) {
        // dupicating the field that's a clone
        // got to set the initial prototype's properties
        const initialPrototype = this.schema.get(cloneOf)!;

        this.schema.set(initialPrototype.uuid, {
          ...initialPrototype,
          clonedBy: [...(initialPrototype.clonedBy ?? []), updatedEntryUuid],
        });
      } else {
        this.schema.set(uuid, {
          ...entry,
          clonedBy: this.isManualDuplication ? [...(clonedBy ?? []), updatedEntryUuid] : undefined,
        });
      }
    }

    this.isManualDuplication = true;
    return updatedEntryUuid;
  }

  private getCopiedEntry(entry: SchemaEntry, updatedUuid: string, parentElemPath?: string[], includeCloneInfo = false) {
    const { path, uuid } = entry;
    const copiedEntry = cloneDeep(entry);

    copiedEntry.uuid = updatedUuid;
    copiedEntry.path = this.getUpdatedPath(path, updatedUuid, parentElemPath);

    if (this.isManualDuplication && includeCloneInfo) {
      if (!copiedEntry.cloneOf) {
        copiedEntry.cloneOf = uuid;
      }

      copiedEntry.clonedBy = undefined;
    }

    return copiedEntry;
  }

  private getUpdatedChildren(children: string[] | undefined, parentElemPath?: string[]) {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = this.schema.get(entryUuid);

      if (!entry || entry.cloneOf) return;

      const { children } = entry;
      const updatedEntryUuid = uuidv4();
      const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid, parentElemPath);
      updatedEntry.children = this.getUpdatedChildren(children, updatedEntry.path);
      updatedEntry.clonedBy = [];

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
