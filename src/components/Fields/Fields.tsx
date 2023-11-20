import classNames from 'classnames';
import { FC, memo, ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import state from '@state';

export type IDrawComponent = {
  schema: Map<string, SchemaEntry>;
  entry: SchemaEntry;
  level?: number;
  disabledFields?: any;
};

type Fields = {
  schema: Map<string, SchemaEntry>;
  uuid: string | null;
  level?: number;
  groupByLevel?: number;
  groupClassName?: string;
  disabledFields?: any;
  scrollToEnabled?: boolean;
  drawComponent?: ({ schema, entry, level, disabledFields }: IDrawComponent) => ReactElement | null;
};

export const Fields: FC<Fields> = memo(
  ({
    schema,
    uuid,
    drawComponent,
    groupByLevel = 2,
    level = 0,
    groupClassName = '',
    disabledFields,
    scrollToEnabled = false,
  }) => {
    const selectedEntries = useRecoilValue(state.config.selectedEntries);
    const entry = uuid && schema.get(uuid);

    if (!entry) return null;

    const { type, children } = entry;

    const isDropdownAndSelected = type === AdvancedFieldType.dropdownOption && selectedEntries.includes(uuid);
    const shouldRenderChildren = isDropdownAndSelected || type !== AdvancedFieldType.dropdownOption;

    return (
      <div
        data-scroll-id={scrollToEnabled ? uuid : null}
        className={classNames({ [groupClassName]: level === groupByLevel, 'profile-entity': level === 0 })}
      >
        {drawComponent &&
          drawComponent({
            schema,
            entry,
            level,
            disabledFields,
          })}
        {shouldRenderChildren &&
          children?.map(uuid => (
            <Fields
              schema={schema}
              drawComponent={drawComponent}
              uuid={uuid}
              key={uuid}
              level={level + 1}
              groupClassName={groupClassName}
              disabledFields={disabledFields}
              scrollToEnabled={scrollToEnabled}
            />
          ))}
      </div>
    );
  },
);
