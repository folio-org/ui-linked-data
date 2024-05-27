import { FC, ReactNode, memo } from 'react';
import classNames from 'classnames';
import { DuplicateGroup } from '@components/DuplicateGroup';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { FormattedMessage } from 'react-intl';

type IExtendedLayout = {
  entry: SchemaEntry;
  children: ReactNode;
  displayName?: string;
  showLabel?: boolean;
  labelContainerClassName?: string;
  hasDuplicateGroupButton?: boolean;
  hasDuplicateSubcomponentButton?: boolean;
  onClickDuplicateGroup?: VoidFunction;
};

export const ExtendedLayout: FC<IExtendedLayout> = memo(
  ({
    children,
    entry,
    displayName,
    showLabel,
    labelContainerClassName,
    hasDuplicateGroupButton,
    hasDuplicateSubcomponentButton,
    onClickDuplicateGroup,
  }) => {
    const { type } = entry;

    return (
      <>
        <div className={classNames({ 'extended-layout-meta': hasDuplicateGroupButton })}>
          {displayName && showLabel && (
            <div className={classNames('label', labelContainerClassName)}>{displayName}</div>
          )}
          {hasDuplicateGroupButton && <DuplicateGroup onClick={onClickDuplicateGroup} />}
        </div>
        {children && (
          <div className="children-container">
            {type === AdvancedFieldType.dropdown && hasDuplicateGroupButton && (
              <div className="label">
                <FormattedMessage id="marva.type" />
              </div>
            )}
            {children}
          </div>
        )}
        {hasDuplicateSubcomponentButton && (
          <DuplicateGroup onClick={onClickDuplicateGroup} hasDeleteButton={false} className="duplicate-subcomponent" />
        )}
      </>
    );
  },
);
