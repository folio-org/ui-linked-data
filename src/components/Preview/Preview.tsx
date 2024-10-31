import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { FormattedMessage } from 'react-intl';
import { FC, memo } from 'react';
import {
  ENTITY_LEVEL,
  GROUP_BY_LEVEL,
  GROUP_CONTENTS_LEVEL,
  PROFILE_BFIDS,
  RESOURCE_TEMPLATE_IDS,
} from '@common/constants/bibframe.constants';
import { PREVIEW_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import Lightbulb16 from '@src/assets/lightbulb-shining-16.svg?react';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { Button, ButtonType } from '@components/Button';
import { getRecordId } from '@common/helpers/record.helper';
import { BFLITE_BFID_TO_BLOCK, BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { getParentEntryUuid } from '@common/helpers/schema.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { RecordStatus } from '@common/constants/record.constants';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';
import './Preview.scss';

type IPreview = {
  altSchema?: Schema;
  altUserValues?: UserValues;
  altInitKey?: string;
  altDisplayNames?: Record<string, string>;
  headless?: boolean;
  hideActions?: boolean;
  forceRenderAllTopLevelEntities?: boolean;
  entityRowDisplay?: boolean;
};

type Fields = {
  base: Schema;
  uuid: string;
  level?: number;
  paths: Array<string>;
};

const NOT_PREVIEWABLE_TYPES = [
  AdvancedFieldType.profile,
  AdvancedFieldType.hidden,
  AdvancedFieldType.dropdownOption,
  AdvancedFieldType.complex,
];

const checkShouldGroupWrap = (entry = {} as SchemaEntry, level: number) => {
  const { children, type } = entry;

  return (!children?.length || type === AdvancedFieldType.dropdown) && level !== GROUP_BY_LEVEL;
};

export const Preview: FC<IPreview> = ({
  altSchema,
  altUserValues,
  altInitKey,
  altDisplayNames,
  headless = false,
  hideActions,
  forceRenderAllTopLevelEntities,
  entityRowDisplay,
}) => {
  const userValuesFromState = useRecoilValue(state.inputs.userValues);
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const setRecordStatus = useSetRecoilState(state.status.recordStatus);
  const record = useRecoilValue(state.inputs.record);
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const schemaFromState = useRecoilValue(state.config.schema);
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const initialSchemaKeyFromState = useRecoilValue(state.config.initialSchemaKey);
  const userValues = altUserValues || userValuesFromState;
  const schema = altSchema || schemaFromState;
  const initialSchemaKey = altInitKey || initialSchemaKeyFromState;

  // TODO: potentially reuse <Fields /> from EditSection ?
  const Fields = memo(({ base, uuid, paths, level = 0 }: Fields) => {
    const { navigateToEditPage } = useNavigateToEditPage();

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

    const { displayName = '', children, type, bfid = '', path, linkedEntry, htmlId } = entry;
    const isDependentDropdownOption =
      type === AdvancedFieldType.dropdownOption && !!schema.get(getParentEntryUuid(path))?.linkedEntry?.controlledBy;
    const visibleDropdownOption =
      isDependentDropdownOption && selectedEntries.includes(uuid) ? <div>{displayName}</div> : null;

    if (visibleDropdownOption) return visibleDropdownOption;

    // don't render empty dropdown options and their descendants
    if (type === AdvancedFieldType.dropdownOption && !isOnBranchWithUserValue) return null;

    // don't render top level entities not selected for preview
    if (isEntity && !currentlyPreviewedEntityBfid.has(bfid) && !forceRenderAllTopLevelEntities) return null;

    // TODO: define and organize the rules for display when there's clarity
    const isPreviewable = !NOT_PREVIEWABLE_TYPES.includes(type as AdvancedFieldType);
    const isGroupable = level <= GROUP_BY_LEVEL;
    const hasChildren = children?.length;
    const selectedUserValues = userValues[uuid];
    const isBranchEnd = !hasChildren;
    const isBranchEndWithoutValues = !selectedUserValues && isBranchEnd;
    const isBranchEndWithValues = !!selectedUserValues;
    const shouldRenderLabelOrPlaceholders =
      (isPreviewable && isGroupable) ||
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
      altDisplayNames?.[displayName] || PREVIEW_ALT_DISPLAY_LABELS[displayName] || displayName;
    const isBlock = level === GROUP_BY_LEVEL && shouldRenderLabelOrPlaceholders;
    const isBlockContents = level === GROUP_CONTENTS_LEVEL;
    const isInstance = bfid === PROFILE_BFIDS.INSTANCE;
    const showEntityActions = !hideActions && isEntity;
    const wrapEntities = forceRenderAllTopLevelEntities && isEntity;

    return (
      <ConditionalWrapper
        condition={isBlock || isBlockContents || wrapEntities}
        wrapper={children => (
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
        )}
      >
        {shouldRenderLabelOrPlaceholders && (
          <strong
            className={classNames({
              'entity-heading': isEntity,
              'sub-heading': isBlock,
              'value-heading': !isGroupable,
            })}
          >
            {isEntity && !isInstance && !altDisplayNames && <Lightbulb16 />}
            {displayNameWithAltValue}
            {showEntityActions && !isInstance && (
              <Button type={ButtonType.Primary} className="toggle-entity-edit" onClick={handleNavigateToEditPage}>
                <FormattedMessage id={`ld.edit${RESOURCE_TEMPLATE_IDS[bfid]}`} />
              </Button>
            )}
            {showEntityActions && isInstance && (
              <PreviewActionsDropdown
                ownId={getRecordId(record, BLOCKS_BFLITE.WORK.uri, BLOCKS_BFLITE.INSTANCE.referenceKey)}
                referenceId={getRecordId(record, BLOCKS_BFLITE.WORK.uri)}
                entityType={BLOCKS_BFLITE.INSTANCE.resourceType}
                handleNavigateToEditPage={handleNavigateToEditPage}
              />
            )}
          </strong>
        )}
        {shouldRenderValuesOrPlaceholders &&
          (userValues[uuid]
            ? userValues[uuid]?.contents?.map(({ label, meta: { uri, parentUri, basicLabel } = {} } = {}) => {
                if (!label && !basicLabel) return;

                const selectedLabel = basicLabel ?? label;

                return (
                  selectedLabel && (
                    <div key={`${selectedLabel}${uri}`}>
                      {uri || parentUri ? (
                        <a className="preview-value-link" target="blank" href={uri || parentUri}>
                          {selectedLabel}
                        </a>
                      ) : (
                        <>{selectedLabel}</>
                      )}
                    </div>
                  )
                );
              })
            : shouldRenderPlaceholders &&
              !isDependentDropdown && (
                <div id={htmlId} className="value-group-wrapper">
                  -
                </div>
              ))}
        {children?.map(uuid => {
          const schemaEntry = schema.get(uuid);

          return (
            <ConditionalWrapper
              key={uuid}
              condition={!isGroupable && checkShouldGroupWrap(schemaEntry, level)}
              wrapper={children =>
                children ? (
                  <div id={schemaEntry?.htmlId} className="value-group-wrapper">
                    {children}
                  </div>
                ) : null
              }
            >
              <Fields key={uuid} uuid={uuid} base={base} paths={paths} level={level + 1} />
            </ConditionalWrapper>
          );
        })}
      </ConditionalWrapper>
    );
  });

  return (
    <div
      className={classNames('preview-panel', { 'preview-panel-row': entityRowDisplay })}
      data-testid="preview-fields"
    >
      {!headless && (
        <h3>
          <FormattedMessage id="ld.preview" />
        </h3>
      )}
      {initialSchemaKey && (
        <Fields
          base={schema}
          uuid={initialSchemaKey}
          paths={Object.keys(userValues)
            .map(key => schema.get(key)?.path || '')
            .flat()}
        />
      )}
    </div>
  );
};
