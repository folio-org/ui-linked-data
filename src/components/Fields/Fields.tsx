import classNames from 'classnames';
import { FC, memo, ReactElement, ReactNode } from 'react';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IDrawComponent } from '@components/EditSection';
import { ENTITY_LEVEL } from '@common/constants/bibframe.constants';
import { DuplicateGroupContainer } from '@components/DuplicateGroupContainer';
import { ConditionalWrapper } from '@components/ConditionalWrapper';
import { DuplicateSubcomponentContainer } from '@components/DuplicateSubcomponentContainer';
import { useInputsState, useProfileState, useUIState } from '@src/store';

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

const getWrapperComponent =
  ({ groupClassName, isCompact }: { groupClassName?: string; isCompact: boolean }) =>
  ({ children }: { children: ReactNode }) => (
    <div className={classNames(groupClassName, { [`${groupClassName}-compact`]: isCompact })}>{children}</div>
  );

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
    const { currentlyEditedEntityBfid } = useUIState();
    const { schema } = useProfileState();
    const { selectedEntries } = useInputsState();

    const entry = uuid && schema?.get(uuid);

    if (!entry) return null;

    const { type, bfid = '', children, twinChildren } = entry;

    const isDropdownAndSelected = type === AdvancedFieldType.dropdownOption && selectedEntries.includes(uuid);
    const shouldRender = level === ENTITY_LEVEL ? currentlyEditedEntityBfid?.has(bfid) : true;
    const shouldRenderChildren = isDropdownAndSelected || type !== AdvancedFieldType.dropdownOption;
    const isCompact = !children?.length && level <= groupByLevel;
    const shouldGroup = !groupingDisabled && level === groupByLevel;

    if (!shouldRender) return null;

    const generateFieldsComponent = ({ ...fieldsProps }: Partial<IFields>) => (
      <Fields
        key={fieldsProps.uuid}
        drawComponent={drawComponent}
        uuid={uuid}
        level={level + 1}
        disabledFields={disabledFields}
        scrollToEnabled={scrollToEnabled}
        {...fieldsProps}
      />
    );

    return (
      <ConditionalWrapper condition={shouldGroup} wrapper={getWrapperComponent({ groupClassName, isCompact })}>
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

            if (!entry) return;

            const { uri = '' } = entry;
            const twinChildrenOfSameType = twinChildren?.[uri];
            const isFirstTwinChild = twinChildrenOfSameType?.[0] === uuid;

            // render cloned / grouped items starting from the main item (prototype) separately
            if (isFirstTwinChild) {
              const restOfTwinChildren = twinChildrenOfSameType.slice(1);

              return level === 1 ? (
                <DuplicateGroupContainer
                  key={uuid}
                  groupClassName={groupClassName}
                  entry={entry}
                  generateComponent={generateFieldsComponent}
                  twins={restOfTwinChildren}
                />
              ) : (
                <DuplicateSubcomponentContainer
                  key={uuid}
                  entry={entry}
                  twins={restOfTwinChildren}
                  generateComponent={generateFieldsComponent}
                />
              );
            }

            // cloned / grouped items already rendered in the prototype
            if (twinChildrenOfSameType) return null;

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
