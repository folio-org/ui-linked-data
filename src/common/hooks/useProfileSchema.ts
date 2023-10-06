import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const useProfileSchema = () => {
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
      const updatedEntryIndex = originalEntryIndex + 1;

      children?.splice(updatedEntryIndex, 0, updatedEntryUuid);
      updatedParentEntry.path = [...path.slice(0, path.length - 1), updatedEntryUuid];
    }

    return updatedParentEntry;
  };

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

    const updatedEntry = _.cloneDeep(entry);
    const copiedGroupUuid = uuidv4();
    updatedEntry.uuid = copiedGroupUuid;
    updatedEntry.path = [...path.slice(0, path.length - 1), copiedGroupUuid];

    const parentEntryUuid = path[path.length - 2];
    const parentEntry = parent || schema.get(parentEntryUuid);

    // update parent entry
    const updatedParentEntry = getUpdatedParentEntry({
      parentEntry,
      originalEntryUuid: uuid,
      updatedEntryUuid: copiedGroupUuid,
    });

    if (updatedParentEntry) {
      schema.set(parentEntryUuid, updatedParentEntry);
      schema.set(copiedGroupUuid, updatedEntry);
    }

    updatedEntry.children = getUpdatedChildren(schema, children);
  };

  const getUpdatedChildren = (schema: Map<string, SchemaEntry>, children: string[] | undefined) => {
    const updatedChildren = [] as string[];

    children?.forEach((entryUuid: string) => {
      const entry = schema.get(entryUuid);

      if (!entry) return;

      const { path, children } = entry;

      const updatedEntry = _.cloneDeep(entry);
      const updatedEntryUuid = uuidv4();

      updatedEntry.uuid = updatedEntryUuid;
      updatedEntry.path = [...path.slice(0, path.length - 1), updatedEntryUuid];
      updatedEntry.children = getUpdatedChildren(schema, children);

      schema.set(updatedEntryUuid, updatedEntry);

      updatedChildren.push(updatedEntryUuid);
    });

    return updatedChildren;
  };

  return { duplicateEntry };
};
