import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { getParentEntryUuid, getUdpatedAssociatedEntries } from '@common/helpers/schema.helper';
import { generateEmptyValueUuid } from '@common/helpers/complexLookup.helper';

export class SchemaWithDuplicatesService implements ISchemaWithDuplicates {
  private isManualDuplication: boolean;

  constructor(
    private schema: Map<string, SchemaEntry>,
    private selectedEntriesService: ISelectedEntries,
  ) {
    this.set(schema);
    this.isManualDuplication = true;
  }

  get() {
    return this.schema;
  }

  set(schema: Schema) {
    this.schema = cloneDeep(schema);
  }

  duplicateEntry(entry: SchemaEntry, isManualDuplication = true) {
    this.isManualDuplication = isManualDuplication;
    const { uuid, path, children, constraints, clonedBy, cloneOf } = entry;

    if (!constraints?.repeatable) return;

    const updatedEntryUuid = uuidv4();
    const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid, undefined, true);
    updatedEntry.children = this.getUpdatedChildren(children, updatedEntry);

    const parentEntryUuid = getParentEntryUuid(path);
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

  private getUpdatedChildren(children: string[] | undefined, parentEntry?: SchemaEntry) {
    const updatedChildren = [] as string[];
    const parentElemPath = parentEntry?.path;
    const newUuids = children?.map(() => uuidv4());

    children?.forEach((entryUuid: string, index: number) => {
      const entry = this.schema.get(entryUuid);

      if (!entry || entry.cloneOf) return;

      const { children } = entry;

      // TODO: refactor this
      let updatedEntryUuid = newUuids?.[index] || uuidv4();
      const isFirstAssociatedEntryElem = parentEntry?.dependsOn && newUuids && index === 0;

      if (isFirstAssociatedEntryElem) {
        updatedEntryUuid = generateEmptyValueUuid(parentEntry.uuid);
        newUuids[index] = updatedEntryUuid;
      }

      let updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid, parentElemPath);
      // Temporary adding the entry to find it in the "getUdpatedAssociatedEntries"
      this.schema.set(updatedEntryUuid, updatedEntry);

      updatedEntry.children = this.getUpdatedChildren(children, updatedEntry);
      updatedEntry.clonedBy = [];

      let primaryEntry;

      if (updatedEntry.dependsOn) {
        const associatedEntries = getUdpatedAssociatedEntries({
          schema: this.schema,
          secondaryEntry: updatedEntry,
          parentEntryChildren: newUuids,
          dependsOnId: updatedEntry.dependsOn,
        });

        primaryEntry = associatedEntries.primaryEntry as SchemaEntry;
        updatedEntry = associatedEntries.secondaryEntry;
      }

      if (primaryEntry && primaryEntry?.uuid) {
        this.schema.set(primaryEntry.uuid, primaryEntry);
      }

      this.schema.set(updatedEntryUuid, updatedEntry);

      if (isFirstAssociatedEntryElem) {
        this.selectedEntriesService.addNew(undefined, updatedEntryUuid);
      } else if (!parentEntry?.dependsOn) {
        this.selectedEntriesService.addDuplicated(entry.uuid, updatedEntryUuid);
      }

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
