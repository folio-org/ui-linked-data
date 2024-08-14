import classNames from 'classnames';
import { FC, memo, ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import state from '@state';
import { IDrawComponent } from '@components/EditSection';
import { ENTITY_LEVEL } from '@common/constants/bibframe.constants';
import { DuplicateGroupContainer } from '@components/DuplicateGroupContainer';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { DuplicateSubcomponentContainer } from '@components/DuplicateSubcomponentContainer';

export type IFields = {
  uuid: string | null;
  level?: number;
  groupByLevel?: number;
  groupClassName?: string;
  disabledFields?: any;
  scrollToEnabled?: boolean;
  drawComponent?: ({ schema, entry, level, disabledFields }: IDrawComponent) => ReactElement | null;
  groupingDisabled?: boolean;
};

export const Fields: FC<IFields> = memo(
  ({
    uuid,
    drawComponent,
    groupByLevel = 2,
    level = 0,
    groupClassName = '',
    disabledFields,
    scrollToEnabled = false,
    groupingDisabled = false,
  }) => {
    const schema = useRecoilValue(state.config.schema);
    const selectedEntries = useRecoilValue(state.config.selectedEntries);
    const collapsedGroups = useRecoilValue(state.ui.collapsedGroups);
    const currentlyEditedEntityBfid = useRecoilValue(state.ui.currentlyEditedEntityBfid);

    const entry = uuid && schema?.get(uuid);

    if (!entry) return null;

    const { type, bfid = '', children, cloneOf = '' } = entry;

    const isDropdownAndSelected = type === AdvancedFieldType.dropdownOption && selectedEntries.includes(uuid);
    const shouldRender =
      !collapsedGroups.includes(cloneOf) && (level === ENTITY_LEVEL ? currentlyEditedEntityBfid?.has(bfid) : true);
    const shouldRenderChildren = isDropdownAndSelected || type !== AdvancedFieldType.dropdownOption;
    const isCompact = !children?.length && level <= groupByLevel;
    const shouldGroup = !groupingDisabled && level === groupByLevel;

    if (!shouldRender) return null;

    const generateFieldsComponent = ({ ...fieldsProps }: Partial<IFields>) => (
      <Fields
        drawComponent={drawComponent}
        uuid={uuid}
        level={level + 1}
        disabledFields={disabledFields}
        scrollToEnabled={scrollToEnabled}
        {...fieldsProps}
      />
    );

    return (
      <ConditionalWrapper
        condition={shouldGroup}
        wrapper={children => (
          <div className={classNames(groupClassName, { [`${groupClassName}-compact`]: isCompact })}>{children}</div>
        )}
      >
        {drawComponent?.({
          schema,
          entry,
          level,
          disabledFields,
          isCompact,
        })}
        {shouldRenderChildren &&
          children?.map(uuid => {
            const entry = schema.get(uuid);

            // render cloned / grouped items starting from the main item (prototype) separately
            if (entry?.clonedBy) {
              return level === 1 ? (
                <DuplicateGroupContainer
                  key={uuid}
                  groupClassName={groupClassName}
                  entry={entry}
                  generateComponent={generateFieldsComponent}
                />
              ) : (
                <DuplicateSubcomponentContainer key={uuid} entry={entry} generateComponent={generateFieldsComponent} />
              );
            }

            // cloned / grouped items already rendered in the prototype
            if (entry?.cloneOf) return null;

            return (
              <Fields
                drawComponent={drawComponent}
                uuid={uuid}
                key={uuid}
                level={level + 1}
                groupClassName={groupClassName}
                disabledFields={disabledFields}
                scrollToEnabled={scrollToEnabled}
              />
            );
          })}
      </ConditionalWrapper>
    );
  },
);
