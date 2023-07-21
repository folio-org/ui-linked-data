import classNames from 'classnames';
import { FC, memo, ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import state from '@state';

export type IDrawComponent = {
  schema: Map<string, SchemaEntry>;
  entry: SchemaEntry;
  level?: number;
};

type Fields = {
  schema: Map<string, SchemaEntry>;
  uuid: string | null;
  level?: number;
  groupByLevel?: number;
  groupClassName?: string;
  drawComponent?: ({ schema, entry, level }: IDrawComponent) => ReactElement | null;
};

export const Fields: FC<Fields> = memo(
  ({ schema, uuid, drawComponent, groupByLevel = 2, level = 0, groupClassName = '' }) => {
    const selectedEntries = useRecoilValue(state.config.selectedEntries);
    const entry = uuid && schema.get(uuid);

    if (!entry) return null;

    const { type, children } = entry;

    const isDropdownAndSelected = type === AdvancedFieldType.dropdownOption && selectedEntries.includes(uuid);
    const shouldRenderChildren = isDropdownAndSelected || type !== AdvancedFieldType.dropdownOption;

    return (
      <div className={classNames({ [groupClassName]: level === groupByLevel })}>
        {drawComponent &&
          drawComponent({
            schema,
            entry,
            level,
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
            />
          ))}
      </div>
    );
  },
);
