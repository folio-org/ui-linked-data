import { ReactNode } from 'react';
import classNames from 'classnames';
import { ENTITY_LEVEL, GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getPreviewFieldsConditions } from '@common/helpers/record.helper';
import { checkEmptyChildren, getParentEntryUuid } from '@common/helpers/schema.helper';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { useInputsState, useProfileState, useUIState } from '@src/store';
import { Labels } from './Labels';
import { Values } from './Values';
import { ChildFields } from './ChildFields';

export const checkShouldGroupWrap = (level: number, entry = {} as SchemaEntry) => {
  const { children, type } = entry;

  return (!children?.length || type === AdvancedFieldType.dropdown || type === AdvancedFieldType.group) &&
    type === AdvancedFieldType.group
    ? level === GROUP_BY_LEVEL
    : level !== GROUP_BY_LEVEL;
};

export const getPreviewWrapper =
  ({
    isBlock,
    wrapEntities,
    isBlockContents,
  }: {
    isBlock: boolean;
    isBlockContents: boolean;
    wrapEntities?: boolean;
  }) =>
  ({ children }: { children: ReactNode }) => (
    <div
      className={classNames({
        'preview-block': isBlock,
        'preview-entity': wrapEntities,
        'preview-block-contents': isBlockContents,
      })}
      data-testid="preview-fields"
    >
      {children}
    </div>
  );

export const getValueGroupWrapper =
  ({ schemaEntry }: { schemaEntry?: SchemaEntry }) =>
  ({ children }: { children: ReactNode }) =>
    children ? (
      <div id={schemaEntry?.htmlId} className="value-group-wrapper">
        {children}
      </div>
    ) : null;

type FieldsProps = {
  base: Schema;
  uuid: string;
  level?: number;
  paths: Array<string>;
  altSchema?: Schema;
  altUserValues?: UserValues;
  altSelectedEntries?: Array<string>;
  altDisplayNames?: Record<string, string>;
  hideEntities?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
};

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
}: FieldsProps) => {
  const { userValues: userValuesFromState, selectedEntries: selectedEntriesFromState } = useInputsState();
  const { schema: schemaFromState } = useProfileState();
  const { currentlyPreviewedEntityBfid } = useUIState();
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
