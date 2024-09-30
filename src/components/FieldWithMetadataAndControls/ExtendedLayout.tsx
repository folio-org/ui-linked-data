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
  htmlId?: string;
  labelContainerClassName?: string;
  hasDuplicateGroupButton?: boolean;
  hasDuplicateSubcomponentButton?: boolean;
  onClickDuplicateGroup?: VoidFunction;
};

export const ExtendedLayout: FC<IExtendedLayout> = memo(
  ({
    children,
    entry,
    htmlId,
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
          {hasDuplicateGroupButton && <DuplicateGroup htmlId={htmlId} onClick={onClickDuplicateGroup} />}
        </div>
        {children && (
          <div className="children-container" data-testid={htmlId}>
            {type === AdvancedFieldType.dropdown && hasDuplicateGroupButton && (
              <div className="label">
                <FormattedMessage id="ld.type" />
              </div>
            )}
            {children}
          </div>
        )}
        {hasDuplicateSubcomponentButton && (
          <DuplicateGroup
            htmlId={htmlId}
            onClick={onClickDuplicateGroup}
            hasDeleteButton={false}
            className="duplicate-subcomponent"
          />
        )}
      </>
    );
  },
);
