import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import {
  generateTwinChildrenKey,
  getParentEntryUuid,
  getUdpatedAssociatedEntries,
} from '@common/helpers/schema.helper';
import { generateEmptyValueUuid } from '@common/helpers/complexLookup.helper';
import { IEntryPropertiesGeneratorService } from './entryPropertiesGenerator.interface';
import { MIN_AMT_OF_SIBLING_ENTRIES_TO_BE_DELETABLE } from '@common/constants/bibframe.constants';

export class SchemaWithDuplicatesService implements ISchemaWithDuplicatesService {
  constructor(
    private schema: Map<string, SchemaEntry>,
    private readonly selectedEntriesService: ISelectedEntries,
    private readonly entryPropertiesGeneratorService?: IEntryPropertiesGeneratorService,
  ) {
    this.set(schema);
  }

  get() {
    return this.schema;
  }

  set(schema: Schema) {
    this.schema = cloneDeep(schema);
  }

  duplicateEntry(entry: SchemaEntry, isAutoDuplication?: boolean) {
    const { path, children, constraints } = entry;

    if (!constraints?.repeatable) return;

    const updatedEntryUuid = uuidv4();
    const updatedEntry = this.getCopiedEntry(entry, updatedEntryUuid);
    updatedEntry.children = this.getUpdatedChildren(children, updatedEntry, isAutoDuplication);

    const parentEntryUuid = getParentEntryUuid(path);
    const parentEntry = this.schema.get(parentEntryUuid);
    const updatedParentEntry = this.getUpdatedParentEntry({
      parentEntry,
      originalEntry: entry,
      updatedEntryUuid: updatedEntryUuid,
    });

    if (updatedParentEntry) {
      this.schema.set(parentEntryUuid, updatedParentEntry);
      this.schema.set(updatedEntryUuid, updatedEntry);
      const twinChildrenKey = generateTwinChildrenKey(entry);

      this.updateDeletabilityAndPositioning(updatedParentEntry?.twinChildren?.[twinChildrenKey]);
      this.entryPropertiesGeneratorService?.applyHtmlIdToEntries(this.schema);
    }

    return updatedEntryUuid;
  }

  deleteEntry(entry: SchemaEntry) {
    const { deletable, uuid, path } = entry;

    if (!deletable) return;

    const parent = this.schema.get(getParentEntryUuid(path));
    const twinChildrenKey = generateTwinChildrenKey(entry);
    const twinSiblings = parent?.twinChildren?.[twinChildrenKey];

    if (twinSiblings) {
      const updatedTwinSiblings = twinSiblings?.filter(twinUuid => twinUuid !== uuid);

      this.schema.set(parent.uuid, {
        ...parent,
        twinChildren: {
          ...parent.twinChildren,
          [twinChildrenKey]: updatedTwinSiblings,
        },
        children: parent.children?.filter(child => child !== uuid),
      });

      this.updateDeletabilityAndPositioning(updatedTwinSiblings);
    }

    const deletedUuids: string[] = [];

    this.deleteEntryAndChildren(entry, deletedUuids);

    return deletedUuids;
  }

  private deleteEntryAndChildren(entry?: SchemaEntry, deletedUuids?: string[]) {
    if (!entry) return;

    const { children, uuid } = entry;

    if (children) {
      for (const child of children) {
        this.deleteEntryAndChildren(this.schema.get(child), deletedUuids);
      }
    }

    deletedUuids?.push(uuid);
    this.schema.delete(uuid);
  }

  private updateDeletabilityAndPositioning(uuids: string[] = []) {
    const deletable = uuids.length >= MIN_AMT_OF_SIBLING_ENTRIES_TO_BE_DELETABLE;

    uuids.forEach((uuid, cloneIndex) =>
      this.schema.set(uuid, { ...(this.schema.get(uuid) ?? {}), deletable, cloneIndex } as SchemaEntry),
    );
  }

  private getCopiedEntry(entry: SchemaEntry, updatedUuid: string, parentElemPath?: string[]) {
    const { path, htmlId } = entry;
    const copiedEntry = cloneDeep(entry);

    copiedEntry.uuid = updatedUuid;
    copiedEntry.path = this.getUpdatedPath(path, updatedUuid, parentElemPath);

    if (htmlId) {
      this.entryPropertiesGeneratorService?.addEntryWithHtmlId(updatedUuid);
    }

    return copiedEntry;
  }

  private getUpdatedChildren(children: string[] | undefined, parentEntry?: SchemaEntry, isAutoDuplication?: boolean) {
    const updatedChildren = [] as string[];
    const parentElemPath = parentEntry?.path;
    const newUuids = children?.map(() => uuidv4());

    children?.forEach((entryUuid: string, index: number) => {
      const entry = this.schema.get(entryUuid);

      if (!entry) return;

      if (isAutoDuplication && this.isAutoDuplicatedEntry(entry)) {
        this.removeEntryReferences(entry, parentEntry);

        return;
      }

      const { children } = entry;
      let updatedEntryUuid = newUuids?.[index] ?? uuidv4();
      const isFirstAssociatedEntryElem = parentEntry?.dependsOn && newUuids && index === 0;

      if (isFirstAssociatedEntryElem) {
        updatedEntryUuid = generateEmptyValueUuid(parentEntry.uuid);
        newUuids[index] = updatedEntryUuid;
      }

      this.updateTwinChildrenEntry(entry, updatedEntryUuid, parentEntry);

      const copiedEntry = this.getCopiedEntry(entry, updatedEntryUuid, parentElemPath);
      this.schema.set(updatedEntryUuid, copiedEntry);

      copiedEntry.children = this.getUpdatedChildren(children, copiedEntry, isAutoDuplication);

      const { updatedEntry, controlledByEntry } = this.getUpdatedAssociatedEntries({
        initialEntry: copiedEntry,
        newUuids,
      });

      if (controlledByEntry?.uuid) {
        this.schema.set(controlledByEntry.uuid, controlledByEntry);
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

  private isAutoDuplicatedEntry(entry: SchemaEntry): boolean {
    return Boolean(entry?.cloneIndex && entry.cloneIndex > 0);
  }

  private removeEntryReferences(entry: SchemaEntry, parentEntry?: SchemaEntry): void {
    if (!parentEntry) return;

    this.removeFromParentChildren(entry, parentEntry);
    this.removeFromTwinChildren(entry, parentEntry);
  }

  private removeFromParentChildren(entry: SchemaEntry, parentEntry: SchemaEntry): void {
    parentEntry.children = parentEntry.children?.filter(childId => childId !== entry.uuid) || [];
  }

  private removeFromTwinChildren(entry: SchemaEntry, parentEntry: SchemaEntry): void {
    const hasTwinChildren = parentEntry.twinChildren && entry.uri && parentEntry.twinChildren[entry.uri];

    if (!hasTwinChildren || !parentEntry.twinChildren || !entry.uri) {
      return;
    }

    parentEntry.twinChildren[entry.uri] = parentEntry.twinChildren[entry.uri].filter(twinId => twinId !== entry.uuid);
  }

  private updateTwinChildrenEntry(entry: SchemaEntry, updatedEntryUuid: string, parentEntry?: SchemaEntry) {
    if (!parentEntry?.twinChildren) return;

    const twinChildrenKey = generateTwinChildrenKey(entry);
    const twinChildren = parentEntry.twinChildren[twinChildrenKey];

    if (twinChildren?.includes(entry.uuid)) {
      const index = twinChildren.indexOf(entry.uuid);

      twinChildren[index] = updatedEntryUuid;
    }
  }

  private getUpdatedParentEntry({
    parentEntry,
    originalEntry,
    updatedEntryUuid,
  }: {
    parentEntry?: SchemaEntry;
    originalEntry: SchemaEntry;
    updatedEntryUuid: string;
  }) {
    if (!parentEntry) return;

    const updatedParentEntry = cloneDeep(parentEntry);
    const { children } = updatedParentEntry;
    const originalEntryIndex = children?.indexOf(originalEntry.uuid);
    const { uri } = originalEntry;
    const childEntryId = uri ?? '';

    if (childEntryId) {
      const twinChildrenKey = generateTwinChildrenKey(originalEntry);

      if (!updatedParentEntry.twinChildren) {
        updatedParentEntry.twinChildren = {};
      }

      updatedParentEntry.twinChildren[twinChildrenKey] = [
        ...new Set([...(updatedParentEntry.twinChildren[twinChildrenKey] ?? []), originalEntry.uuid, updatedEntryUuid]),
      ];
    }

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

  private getUpdatedAssociatedEntries({ initialEntry, newUuids }: { initialEntry: SchemaEntry; newUuids?: string[] }) {
    let updatedEntry = initialEntry;
    let controlledByEntry;

    if (updatedEntry.dependsOn) {
      const associatedEntries = getUdpatedAssociatedEntries({
        schema: this.schema,
        dependentEntry: updatedEntry,
        parentEntryChildren: newUuids,
        dependsOnId: updatedEntry.dependsOn,
      });

      controlledByEntry = associatedEntries.controlledByEntry as SchemaEntry;
      updatedEntry = associatedEntries.dependentEntry;
    }

    return { updatedEntry, controlledByEntry };
  }
}
