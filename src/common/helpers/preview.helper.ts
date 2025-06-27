import { GROUP_BY_LEVEL, GROUP_CONTENTS_LEVEL, PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { AdvancedFieldType, NOT_PREVIEWABLE_TYPES } from '@common/constants/uiControls.constants';
import { PREVIEW_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';

export const checkShouldGroupWrap = (level: number, entry = {} as SchemaEntry) => {
  const { children, type } = entry;

  return (!children?.length || type === AdvancedFieldType.dropdown || type === AdvancedFieldType.group) &&
    type === AdvancedFieldType.group
    ? level === GROUP_BY_LEVEL
    : level !== GROUP_BY_LEVEL;
};

export const getPreviewFieldsConditions = ({
  entry,
  level,
  userValues,
  uuid,
  schema,
  isOnBranchWithUserValue,
  altDisplayNames,
  hideEntities,
  isEntity,
  forceRenderAllTopLevelEntities,
}: {
  entry: SchemaEntry;
  level: number;
  userValues: UserValues;
  uuid: string;
  schema: Schema;
  isOnBranchWithUserValue: boolean;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  isEntity: boolean;
  forceRenderAllTopLevelEntities?: boolean;
}) => {
  const { displayName = '', children, type, bfid = '', linkedEntry } = entry;

  const isPreviewable = !NOT_PREVIEWABLE_TYPES.includes(type as AdvancedFieldType);
  const isGroupable = level <= GROUP_BY_LEVEL;
  const hasChildren = children?.length;
  const selectedUserValues = userValues[uuid];
  const isBranchEnd = !hasChildren;
  const isBranchEndWithoutValues = !selectedUserValues && isBranchEnd;
  const isBranchEndWithValues = !!selectedUserValues;
  const shouldRenderLabelOrPlaceholders =
    (!(isEntity && hideEntities) && isPreviewable && isGroupable) ||
    type === AdvancedFieldType.dropdown ||
    (isBranchEndWithValues && type !== AdvancedFieldType.complex) ||
    isBranchEndWithoutValues;
  const hasOnlyDropdownChildren =
    hasChildren &&
    !children.filter(childUuid => schema.get(childUuid)?.type !== AdvancedFieldType.dropdownOption).length;
  const shouldRenderValuesOrPlaceholders = !hasChildren || hasOnlyDropdownChildren;
  const shouldRenderPlaceholders =
    (isPreviewable && isGroupable && !isOnBranchWithUserValue) || !isOnBranchWithUserValue;
  const isDependentDropdown = type === AdvancedFieldType.dropdown && !!linkedEntry?.controlledBy;
  const displayNameWithAltValue =
    altDisplayNames?.[displayName] ?? PREVIEW_ALT_DISPLAY_LABELS[displayName] ?? displayName;
  const isBlock = level === GROUP_BY_LEVEL && shouldRenderLabelOrPlaceholders;
  const isBlockContents = level === GROUP_CONTENTS_LEVEL;
  const isInstance = bfid === PROFILE_BFIDS.INSTANCE;
  const wrapEntities = forceRenderAllTopLevelEntities && isEntity;

  return {
    isGroupable,
    shouldRenderLabelOrPlaceholders,
    shouldRenderValuesOrPlaceholders,
    shouldRenderPlaceholders,
    isDependentDropdown,
    displayNameWithAltValue,
    isBlock,
    isBlockContents,
    isInstance,
    wrapEntities,
  };
};
