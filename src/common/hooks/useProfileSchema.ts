import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const useProfileSchema = () => {
  const duplicateEntry = (schema: Map<string, SchemaEntry>, entry: SchemaEntry) => {
    const updatedSchema = _.cloneDeep(schema);
    traverseSchemaEntries({ schema: updatedSchema, entry });

    return updatedSchema;
  };

  const traverseSchemaEntries = ({
    schema,
    entry,
    parent,
  }: {
    schema: Map<string, SchemaEntry>;
    entry: SchemaEntry;
    parent?: SchemaEntry;
  }) => {
    const { uuid, path, children } = entry;
    const updatedEntryUuid = uuidv4();
    const updatedEntry = getCopiedEntry(schema, entry, updatedEntryUuid);

    const parentEntryUuid = path[path.length - 2];
    const parentEntry = parent || schema.get(parentEntryUuid);

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

  const getCopiedEntry = (schema: Map<string, SchemaEntry>, entry: SchemaEntry, uuid: string) => {
    const { path, children } = entry;
    const copiedEntry = _.cloneDeep(entry);

    copiedEntry.uuid = uuid;
    copiedEntry.path = getUpdatedPath(path, uuid);
    copiedEntry.children = getUpdatedChildren(schema, children);

    return copiedEntry;
  };

  const getUpdatedChildren = (schema: Map<string, SchemaEntry>, children: string[] | undefined) => {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = schema.get(entryUuid);

      if (!entry) return;

      const updatedEntryUuid = uuidv4();
      const updatedEntry = getCopiedEntry(schema, entry, updatedEntryUuid);

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

  return { duplicateEntry };
};
