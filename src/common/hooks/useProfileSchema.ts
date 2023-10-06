import _ from 'lodash';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';

export const useProfileSchema = () => {
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);

  const getUpdatedSchemaWithCopiedEntries = (
    schema: Map<string, SchemaEntry>,
    entry: SchemaEntry,
    selectedEntries: string[],
  ) => {
    const updatedSchema = _.cloneDeep(schema);
    traverseSchemaEntries({ schema: updatedSchema, entry, selectedEntries });

    return updatedSchema;
  };

  const traverseSchemaEntries = ({
    schema,
    entry,
    selectedEntries,
  }: {
    schema: Map<string, SchemaEntry>;
    entry: SchemaEntry;
    selectedEntries?: string[];
  }) => {
    const { uuid, path, children } = entry;
    const updatedEntryUuid = uuidv4();
    const updatedEntry = getCopiedEntry(entry, updatedEntryUuid);
    updatedEntry.children = getUpdatedChildren({ schema, children, selectedEntries });

    const parentEntryUuid = path[path.length - 2];
    const parentEntry = schema.get(parentEntryUuid);

    // update parent entry
    const updatedParentEntry = getUpdatedParentEntry({
      parentEntry,
      originalEntryUuid: uuid,
      updatedEntryUuid: updatedEntryUuid,
    });

    if (updatedParentEntry) {
      schema.set(parentEntryUuid, updatedParentEntry);
      schema.set(updatedEntryUuid, updatedEntry);
    }
  };

  const getCopiedEntry = (entry: SchemaEntry, uuid: string) => {
    const { path } = entry;
    const copiedEntry = _.cloneDeep(entry);

    copiedEntry.uuid = uuid;
    copiedEntry.path = getUpdatedPath(path, uuid);

    return copiedEntry;
  };

  const getUpdatedChildren = ({
    schema,
    children,
    selectedEntries,
  }: {
    schema: Map<string, SchemaEntry>;
    children: string[] | undefined;
    selectedEntries?: string[];
  }) => {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = schema.get(entryUuid);

      if (!entry) return;

      const { children } = entry;
      const updatedEntryUuid = uuidv4();
      const updatedSelectedEntries = getUpdatedSelectedEntries(selectedEntries, entry.uuid, updatedEntryUuid);
      const updatedEntry = getCopiedEntry(entry, updatedEntryUuid);

      if (updatedSelectedEntries) {
        setSelectedEntries(updatedSelectedEntries);
      }

      updatedEntry.children = getUpdatedChildren({ schema, children });

      schema.set(updatedEntryUuid, updatedEntry);

      updatedChildren.push(updatedEntryUuid);
    });

    return updatedChildren;
  };

  const getUpdatedParentEntry = ({
    parentEntry,
    originalEntryUuid,
    updatedEntryUuid,
  }: {
    parentEntry?: SchemaEntry;
    originalEntryUuid: string;
    updatedEntryUuid: string;
  }) => {
    if (!parentEntry) return;

    const updatedParentEntry = _.cloneDeep(parentEntry);
    const { children, path } = updatedParentEntry;
    const originalEntryIndex = children?.indexOf(originalEntryUuid);

    if (originalEntryIndex) {
      // Add the UUID of the copied entry to the parent element's array of children,
      // saving the order of the elements
      children?.splice(originalEntryIndex + 1, 0, updatedEntryUuid);
      updatedParentEntry.path = getUpdatedPath(path, updatedEntryUuid);
    }

    return updatedParentEntry;
  };

  const getUpdatedSelectedEntries = (
    selectedEntries: string[] | undefined,
    originalEntryUuid: string,
    updatedEntryUuid: string,
  ) => {
    if (!selectedEntries?.includes(originalEntryUuid)) return;

    return [...selectedEntries, updatedEntryUuid];
  };

  const getUpdatedPath = (path: string[], uuid: string) => {
    const updatedPath = [...path];
    updatedPath[path.length - 1] = uuid;

    return updatedPath;
  };

  return { getUpdatedSchemaWithCopiedEntries };
};
