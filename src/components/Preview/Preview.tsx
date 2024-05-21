import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import state from '@state';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { FormattedMessage } from 'react-intl';
import { FC, memo } from 'react';
import { ENTITY_LEVEL, GROUP_BY_LEVEL, GROUP_CONTENTS_LEVEL } from '@common/constants/bibframe.constants';
import { PREVIEW_ALT_DISPLAY_LABELS } from '@common/constants/uiElements.constants';
import Lightbulb16 from '@src/assets/lightbulb-shining-16.svg?react';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import './Preview.scss';

type IPreview = {
  altSchema?: Map<string, SchemaEntry>;
  altUserValues?: UserValues;
  altInitKey?: string;
  headless?: boolean;
};

type Fields = {
  base: Map<string, SchemaEntry>;
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

export const Preview: FC<IPreview> = ({ altSchema, altUserValues, altInitKey, headless = false }) => {
  const userValuesFromState = useRecoilValue(state.inputs.userValues);
  const currentlyPreviewedEntityBfid = useRecoilValue(state.ui.currentlyPreviewedEntityBfid);
  const schemaFromState = useRecoilValue(state.config.schema);
  const initialSchemaKeyFromState = useRecoilValue(state.config.initialSchemaKey);
  const userValues = altUserValues || userValuesFromState;
  const schema = altSchema || schemaFromState;
  const initialSchemaKey = altInitKey || initialSchemaKeyFromState;

  // TODO: potentially reuse <Fields /> from EditSection ?
  const Fields = memo(({ base, uuid, paths, level = 0 }: Fields) => {
    const entry = base.get(uuid);
    const isOnBranchWithUserValue = paths.includes(uuid);
    const isEntity = level === ENTITY_LEVEL;

    if (!entry) return null;

    const { displayName = '', children, type, bfid = '' } = entry;

    // don't render empty dropdown options and their descendants
    if (type === AdvancedFieldType.dropdownOption && !isOnBranchWithUserValue) return null;

    // don't render top level entities not selected for preview
    if (isEntity && !currentlyPreviewedEntityBfid.has(bfid)) return null;

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
    const displayNameWithAltValue = PREVIEW_ALT_DISPLAY_LABELS[displayName] || displayName;
    const isBlock = level === GROUP_BY_LEVEL && shouldRenderLabelOrPlaceholders;
    const isBlockContents = level === GROUP_CONTENTS_LEVEL;

    return (
      <ConditionalWrapper
        condition={isBlock || isBlockContents}
        wrapper={children => (
          <div
            className={classNames({
              'preview-block': isBlock,
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
            {isEntity && <Lightbulb16 />}
            {displayNameWithAltValue}
          </strong>
        )}
        {shouldRenderValuesOrPlaceholders &&
          (userValues[uuid]
            ? userValues[uuid]?.contents?.map(
                ({ label, meta: { uri, parentUri } = {} } = {}) =>
                  label && (
                    <div key={`${label}${uri}`}>
                      <div>
                        {uri || parentUri ? (
                          <a className="preview-value-link" href={uri || parentUri}>
                            {label}
                          </a>
                        ) : (
                          label
                        )}
                      </div>
                    </div>
                  ),
              )
            : shouldRenderPlaceholders && <div className="value-group-wrapper">-</div>)}
        {children?.map((uuid: string) => (
          <ConditionalWrapper
            key={uuid}
            condition={!isGroupable && checkShouldGroupWrap(schema.get(uuid), level)}
            wrapper={children => <div className="value-group-wrapper">{children}</div>}
          >
            <Fields key={uuid} uuid={uuid} base={base} paths={paths} level={level + 1} />
          </ConditionalWrapper>
        ))}
      </ConditionalWrapper>
    );
  });

  return (
    <div className="preview-panel" data-testid="preview-fields">
      {!headless && (
        <h3>
          <FormattedMessage id="marva.preview" />
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
