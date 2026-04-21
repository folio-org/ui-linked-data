import { ENTITY_LEVEL } from '@/common/constants/bibframe.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { getPreviewFieldsConditions } from '@/common/helpers/preview.helper';
import { checkEmptyChildren, getParentEntryUuid } from '@/common/helpers/schema.helper';
import { ConditionalWrapper } from '@/components/ConditionalWrapper';

import { useInputsState, useProfileState, useUIState } from '@/store';

import { ChildFields } from './ChildFields';
import { Labels } from './Labels';
import { Values } from './Values';
import { FieldProps } from './preview.types';
import { getPreviewWrapper } from './preview.wrappers';

export const Fields = ({
  base,
  uuid,
  paths,
  level = 0,
  altSchema,
  altUserValues,
  altSelectedEntries,
  altDisplayNames,
  hideEntities,
  forceRenderAllTopLevelEntities,
}: FieldProps) => {
  const { userValues: userValuesFromState, selectedEntries: selectedEntriesFromState } = useInputsState([
    'userValues',
    'selectedEntries',
  ]);
  const { schema: schemaFromState } = useProfileState(['schema']);
  const { currentlyPreviewedEntityBfid } = useUIState(['currentlyPreviewedEntityBfid']);
  const userValues = altUserValues || userValuesFromState;
  const schema = altSchema || schemaFromState;
  const selectedEntries = altSelectedEntries || selectedEntriesFromState;

  const entry = base.get(uuid);
  const isOnBranchWithUserValue = paths.includes(uuid);
  const isEntity = level === ENTITY_LEVEL;
  const hasEmptyChildren = checkEmptyChildren(base, entry);

  const isDependentDropdownOption =
    entry?.type === AdvancedFieldType.dropdownOption &&
    !!schema.get(getParentEntryUuid(entry?.path))?.linkedEntry?.controlledBy;

  const controlledEntry = schema.get(getParentEntryUuid(entry?.path || []))?.linkedEntry?.controlledBy;
  const controlledEntryValue = controlledEntry ? userValues[controlledEntry] : undefined;
  const visibleDropdownOption =
    isDependentDropdownOption && controlledEntryValue && selectedEntries.includes(uuid) ? (
      <div>{entry?.displayName}</div>
    ) : null;

  if (visibleDropdownOption) return visibleDropdownOption;

  if (!entry || hasEmptyChildren) return null;

  const { children, type, bfid = '', htmlId } = entry;

  // don't render empty dropdown options and their descendants
  if (type === AdvancedFieldType.dropdownOption && !isOnBranchWithUserValue) return null;

  // don't render top level entities not selected for preview
  if (isEntity && !currentlyPreviewedEntityBfid.has(bfid) && !forceRenderAllTopLevelEntities) return null;

  const isGroupParentEntryType = base.get(entry.path[entry.path.length - 2])?.type === AdvancedFieldType.group;

  const {
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
  } = getPreviewFieldsConditions({
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
  });

  const renderChildren = (children: string[] | undefined, isGroup = false) => {
    return (
      <ChildFields
        schema={base}
        entryChildren={children}
        paths={paths}
        level={level}
        altSchema={altSchema}
        altUserValues={altUserValues}
        altSelectedEntries={altSelectedEntries}
        altDisplayNames={altDisplayNames}
        hideEntities={hideEntities}
        forceRenderAllTopLevelEntities={forceRenderAllTopLevelEntities}
        isGroupable={isGroupable}
        isGroup={isGroup}
        renderField={props => <Fields {...props} />}
      />
    );
  };

  return (
    <ConditionalWrapper
      condition={
        ((isBlock || isBlockContents || wrapEntities) && !isGroupParentEntryType) ||
        entry.type === AdvancedFieldType.group
      }
      wrapper={getPreviewWrapper({ isBlock, isBlockContents, wrapEntities })}
    >
      {shouldRenderLabelOrPlaceholders && (
        <Labels
          isEntity={isEntity}
          isBlock={isBlock}
          isGroupable={isGroupable}
          isInstance={isInstance}
          altDisplayNames={altDisplayNames}
          displayNameWithAltValue={displayNameWithAltValue}
        />
      )}
      {shouldRenderValuesOrPlaceholders && (
        <Values
          userValues={userValues}
          uuid={uuid}
          shouldRenderPlaceholders={shouldRenderPlaceholders}
          isDependentDropdown={isDependentDropdown}
          htmlId={htmlId}
        />
      )}
      {entry.type === AdvancedFieldType.group ? (
        <div className="preview-block-contents" data-testid="preview-fields">
          {renderChildren(children, true)}
        </div>
      ) : (
        renderChildren(children)
      )}
    </ConditionalWrapper>
  );
};
