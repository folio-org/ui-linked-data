import { GROUP_BY_LEVEL } from '@/common/constants/bibframe.constants';
import { AdvancedFieldType, UI_CONTROLS_LIST } from '@/common/constants/uiControls.constants';

import { hasChildEntry } from './schema.helper';

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
  const { type, children, constraints } = entry;

  let isRepeatableGroup =
    level === GROUP_BY_LEVEL &&
    !isDisabled &&
    (constraints?.repeatable !== false || typeof constraints === 'undefined');

  if (isRepeatableGroup) {
    const isGroupType = type === AdvancedFieldType.group;
    const isEntryWithChildren = hasChildEntry(schema, children);

    if (isGroupType && !isEntryWithChildren) {
      isRepeatableGroup = isEntryWithChildren;
    }
  }

  return isRepeatableGroup;
};

export const checkRepeatableSubcomponent = ({ entry, isDisabled }: { entry: SchemaEntry; isDisabled: boolean }) => {
  const { type, constraints } = entry;
  const isRepeatable =
    !isDisabled &&
    (constraints?.repeatable !== false || typeof constraints === 'undefined') &&
    // remove this condition after updating the profile
    type === AdvancedFieldType.literal;

  return !!isRepeatable && UI_CONTROLS_LIST.includes(type as AdvancedFieldType);
};
