import { FC, ReactNode, memo } from 'react';
import classNames from 'classnames';
import { DuplicateGroup } from '@components/DuplicateGroup';

type ICompactLayout = {
  children: ReactNode;
  entry: SchemaEntry;
  displayName?: string;
  showLabel?: boolean;
  labelContainerClassName?: string;
  hasDuplicateGroupButton?: boolean;
  htmlId?: string;
  onClickDuplicateGroup?: VoidFunction;
  onClickDeleteGroup?: VoidFunction;
};

export const CompactLayout: FC<ICompactLayout> = memo(
  ({
    children,
    entry: { deletable },
    displayName,
    showLabel,
    labelContainerClassName,
    htmlId,
    hasDuplicateGroupButton,
    onClickDuplicateGroup,
    onClickDeleteGroup,
  }) => {
    return (
      <>
        {displayName && showLabel && <div className={classNames('label', labelContainerClassName)}>{displayName}</div>}
        <div className="children-container" data-testid={htmlId}>
          {children}
        </div>
        {hasDuplicateGroupButton && (
          <DuplicateGroup
            deleteDisabled={!deletable}
            htmlId={htmlId}
            onClickDuplicate={onClickDuplicateGroup}
            onClickDelete={onClickDeleteGroup}
          />
        )}
      </>
    );
  },
);
