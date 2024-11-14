import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import {
  ENTITY_LEVEL,
  GROUP_BY_LEVEL,
  GROUP_CONTENTS_LEVEL,
  PROFILE_BFIDS,
  RESOURCE_TEMPLATE_IDS,
} from '@common/constants/bibframe.constants';
import { BFLITE_BFID_TO_BLOCK, BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';
import { RecordStatus } from '@common/constants/record.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { PREVIEW_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { getRecordId } from '@common/helpers/record.helper';
import { getParentEntryUuid } from '@common/helpers/schema.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { Button, ButtonType } from '@components/Button';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { PreviewActionsDropdown } from '@components/PreviewActionsDropdown';
import Lightbulb16 from '@src/assets/lightbulb-shining-16.svg?react';
import state from '@state';

const NOT_PREVIEWABLE_TYPES = [
  AdvancedFieldType.profile,
  AdvancedFieldType.hidden,
  AdvancedFieldType.dropdownOption,
  AdvancedFieldType.complex,
];

const checkShouldGroupWrap = (level: number, entry = {} as SchemaEntry) => {
  const { children, type } = entry;

  return (!children?.length || type === AdvancedFieldType.dropdown) && level !== GROUP_BY_LEVEL;
};

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

export const Fields: FC<FieldsProps> = memo(
  ({
    base,
    uuid,
    paths,
    level = 0,
    altSchema,
    altUserValues,
    altDisplayNames,
    hideActions,
    forceRenderAllTopLevelEntities,
  }) => {
    const selectedEntries = useRecoilValue(state.config.selectedEntries);
    const setRecordStatus = useSetRecoilState(state.status.recordStatus);
    const record = useRecoilValue(state.inputs.record);
    const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
    const isEdited = useRecoilValue(state.status.recordIsEdited);
    const userValuesFromState = useRecoilValue(state.inputs.userValues);
    const schemaFromState = useRecoilValue(state.config.schema);
    const userValues = altUserValues || userValuesFromState;
    const schema = altSchema || schemaFromState;

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
      altDisplayNames?.[displayName] ?? PREVIEW_ALT_DISPLAY_LABELS[displayName] ?? displayName;
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
                        <a className="preview-value-link" target="blank" href={uri ?? parentUri}>
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
              condition={!isGroupable && checkShouldGroupWrap(level, schemaEntry)}
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
  },
);
