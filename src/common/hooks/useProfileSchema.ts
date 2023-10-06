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
    selectedEntries: string[];
  }) => {
    const { uuid, path, children } = entry;
    const updatedEntryUuid = uuidv4();
    const updatedEntry = getCopiedEntry({ schema, entry, uuid: updatedEntryUuid, selectedEntries });

    const parentEntryUuid = path[path.length - 2];
    const parentEntry = schema.get(parentEntryUuid);

    // update parent entry
    const updatedParentEntry = getUpdatedParentEntry({
      parentEntry,
      originalEntryUuid: uuid,
      updatedEntryUuid,
    });

    if (updatedParentEntry) {
      schema.set(parentEntryUuid, updatedParentEntry);
      schema.set(updatedEntryUuid, updatedEntry);
    }

    updatedEntry.children = getUpdatedChildren(schema, children);
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

  const getCopiedEntry = ({
    schema,
    entry,
    uuid,
    selectedEntries,
  }: {
    schema: Map<string, SchemaEntry>;
    entry: SchemaEntry;
    uuid: string;
    selectedEntries?: string[];
  }) => {
    const { path, children } = entry;
    const copiedEntry = _.cloneDeep(entry);

    copiedEntry.uuid = uuid;
    copiedEntry.path = getUpdatedPath(path, uuid);
    copiedEntry.children = getUpdatedChildren(schema, children, selectedEntries);

    return copiedEntry;
  };

  const getUpdatedChildren = (
    schema: Map<string, SchemaEntry>,
    children: string[] | undefined,
    selectedEntries?: string[] | undefined,
  ) => {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = schema.get(entryUuid);

      if (!entry) return;

      const updatedEntryUuid = uuidv4();
      const updatedEntry = getCopiedEntry({ schema, entry, uuid: updatedEntryUuid });

      if (selectedEntries?.includes(entry.uuid)) {
        const updatedSelectedEntries = [...selectedEntries, updatedEntryUuid];

        setSelectedEntries(updatedSelectedEntries);
      }

      schema.set(updatedEntryUuid, updatedEntry);

      updatedChildren.push(updatedEntryUuid);
    });

    return updatedChildren;
  };

  const getUpdatedPath = (path: string[], uuid: string) => {
    const updatedPath = [...path];
    updatedPath[path.length - 1] = uuid;

    return updatedPath;
  };

  return { getUpdatedSchemaWithCopiedEntries };
};
