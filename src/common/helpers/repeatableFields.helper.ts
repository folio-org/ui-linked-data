import { GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { findParentEntryByProperty, hasChildEntry } from './schema.helper';
import { AdvancedFieldType, UI_CONTROLS_LIST } from '@common/constants/uiControls.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

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
  const { type, path, constraints } = entry;
  const isRepeatable =
    !isDisabled &&
    constraints?.repeatable &&
    // show "Duplicate" button only for Provision Activity's subcomponents
    // TODO: change or remove to display "Duplicate" button for other groups
    findParentEntryByProperty({
      schema,
      path,
      key: 'uriBFLite',
      value: BFLITE_URIS.PROVISION_ACTIVITY,
    });

  return isRepeatable && UI_CONTROLS_LIST.includes(type as AdvancedFieldType);
};
