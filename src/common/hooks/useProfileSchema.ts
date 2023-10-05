import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const useProfileSchema = () => {
  const getUpdateParentElement = ({
    parentEntry,
    originalElemUuid,
    copiedElemUuid,
  }: {
    parentEntry?: SchemaEntry;
    originalElemUuid: string;
    copiedElemUuid: string;
  }) => {
    if (!parentEntry) return;

    const copiedParentElem = _.cloneDeep(parentEntry);
    const { children } = copiedParentElem;
    const originalElemIndex = children?.indexOf(originalElemUuid);

    if (originalElemIndex) {
      const copiedElementIndex = originalElemIndex + 1;

      children?.splice(copiedElementIndex, 0, copiedElemUuid);
    }

    return copiedParentElem;
  };

  const duplicateEntry = (schema: Map<string, SchemaEntry>, entry: SchemaEntry) => {
    const { uuid, path } = entry;

    const copiedSchema = _.cloneDeep(schema);
    const copiedGroupUuid = uuidv4();
    const copiedGroup = _.cloneDeep(entry);
    copiedGroup.uuid = copiedGroupUuid;

    const parentEntryUuid = path[path.length - 2];
    const parentEntry = copiedSchema.get(parentEntryUuid);

    // update parent entry
    const updatedParentEntry = getUpdateParentElement({
      parentEntry,
      originalElemUuid: uuid,
      copiedElemUuid: copiedGroupUuid,
    });

    if (updatedParentEntry) {
      copiedSchema.delete(parentEntryUuid);
      copiedSchema.set(parentEntryUuid, updatedParentEntry);
      copiedSchema.set(copiedGroupUuid, copiedGroup);
    }

    // TODO: copy and update children entries

    return copiedSchema;
  };

  return { duplicateEntry };
};
