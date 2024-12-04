import { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { ENTITY_LEVEL, GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { BFLITE_BFID_TO_BLOCK } from '@common/constants/bibframeMapping.constants';
import { RecordStatus } from '@common/constants/record.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { getRecordId, getPreviewFieldsConditions } from '@common/helpers/record.helper';
import { getParentEntryUuid } from '@common/helpers/schema.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { useInputsState, useProfileState, useStatusState } from '@src/store';
import state from '@state';
import { Labels } from './Labels';
import { Values } from './Values';

const checkShouldGroupWrap = (level: number, entry = {} as SchemaEntry) => {
  const { children, type } = entry;

  return (!children?.length || type === AdvancedFieldType.dropdown) && level !== GROUP_BY_LEVEL;
};

const getPreviewWrapper =
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

const getValueGroupWrapper =
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
  altDisplayNames?: Record<string, string>;
  hideActions?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
};

export const Fields = ({
  base,
  uuid,
  paths,
  level = 0,
  altSchema,
  altUserValues,
  altDisplayNames,
  hideActions,
  forceRenderAllTopLevelEntities,
}: FieldsProps) => {
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const { userValues: userValuesFromState, record, selectedEntries } = useInputsState();
  const { schema: schemaFromState } = useProfileState();
  const { isEditedRecord: isEdited, setRecordStatus } = useStatusState();
  const { navigateToEditPage } = useNavigateToEditPage();
  const userValues = altUserValues || userValuesFromState;
  const schema = altSchema || schemaFromState;

  const handleNavigateToEditPage = () => {
    setRecordStatus({ type: isEdited ? RecordStatus.saveAndClose : RecordStatus.close });

    const typedSelectedBlock = BFLITE_BFID_TO_BLOCK[bfid as keyof typeof BFLITE_BFID_TO_BLOCK];
    const id = getRecordId(record, typedSelectedBlock.reference.uri, typedSelectedBlock.referenceKey);

    navigateToEditPage(generateEditResourceUrl(id));
  };

  const entry = base.get(uuid);
  const isOnBranchWithUserValue = paths.includes(uuid);
  const isEntity = level === ENTITY_LEVEL;

  if (!entry) return null;

  const { displayName = '', children, type, bfid = '', path, htmlId } = entry;
  const isDependentDropdownOption =
    type === AdvancedFieldType.dropdownOption && !!schema.get(getParentEntryUuid(path))?.linkedEntry?.controlledBy;
  const visibleDropdownOption =
    isDependentDropdownOption && selectedEntries.includes(uuid) ? <div>{displayName}</div> : null;

  if (visibleDropdownOption) return visibleDropdownOption;

  // don't render empty dropdown options and their descendants
  if (type === AdvancedFieldType.dropdownOption && !isOnBranchWithUserValue) return null;

  // don't render top level entities not selected for preview
  if (isEntity && !currentlyPreviewedEntityBfid.has(bfid) && !forceRenderAllTopLevelEntities) return null;

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
    showEntityActions,
    wrapEntities,
  } = getPreviewFieldsConditions({
    entry,
    level,
    userValues,
    uuid,
    schema,
    isOnBranchWithUserValue,
    altDisplayNames,
    hideActions,
    isEntity,
    forceRenderAllTopLevelEntities,
  });

  return (
    <ConditionalWrapper
      condition={isBlock || isBlockContents || wrapEntities}
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
          showEntityActions={showEntityActions}
          bfid={bfid}
          handleNavigateToEditPage={handleNavigateToEditPage}
          record={record}
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
      {children?.map(uuid => {
        const schemaEntry = schema.get(uuid);

        return (
          <ConditionalWrapper
            key={uuid}
            condition={!isGroupable && checkShouldGroupWrap(level, schemaEntry)}
            wrapper={getValueGroupWrapper({ schemaEntry })}
          >
            <Fields
              key={uuid}
              uuid={uuid}
              base={base}
              paths={paths}
              level={level + 1}
              altSchema={altSchema}
              altUserValues={altUserValues}
              altDisplayNames={altDisplayNames}
              hideActions={hideActions}
              forceRenderAllTopLevelEntities={forceRenderAllTopLevelEntities}
            />
          </ConditionalWrapper>
        );
      })}
    </ConditionalWrapper>
  );
};
