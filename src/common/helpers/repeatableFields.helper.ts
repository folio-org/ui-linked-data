import { GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { hasChildEntry } from './schema.helper';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

export const checkRepeatableGroup = ({
  schema,
  entry,
  level,
  isDisabled,
}: {
  schema: Map<string, SchemaEntry>;
  entry: SchemaEntry;
  level?: number;
  isDisabled: boolean;
}) => {
  const { type, children } = entry;

  let isRepeatableGroup = level === GROUP_BY_LEVEL && !isDisabled;
  const isGroupType = type === AdvancedFieldType.group;
  const isEntryWithChildren = hasChildEntry(schema, children);

  if (isRepeatableGroup && isGroupType && !isEntryWithChildren) {
    isRepeatableGroup = isEntryWithChildren;
  }

  return isRepeatableGroup;
};
