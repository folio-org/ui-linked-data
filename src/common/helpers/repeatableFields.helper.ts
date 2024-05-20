import { GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { findParentEntryByUriBFLite, hasChildEntry } from './schema.helper';
import { AdvancedFieldType, UI_CONTROLS_LIST } from '@common/constants/uiControls.constants';

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

  if (isRepeatableGroup) {
    const isGroupType = type === AdvancedFieldType.group;
    const isEntryWithChildren = hasChildEntry(schema, children);

    if (isGroupType && !isEntryWithChildren) {
      isRepeatableGroup = isEntryWithChildren;
    }
  }

  return isRepeatableGroup;
};

export const checkRepeatableSubcomponent = ({
  schema,
  entry,
  isDisabled,
}: {
  schema: Map<string, SchemaEntry>;
  entry: SchemaEntry;
  isDisabled: boolean;
}) => {
  const { type, path } = entry;

  if (isDisabled || !findParentEntryByUriBFLite(schema, path, 'https://bibfra.me/vocab/marc/provisionActivity'))
    return false;

  if (UI_CONTROLS_LIST.includes(type as AdvancedFieldType)) {
    return true;
  }

  return false;
};
