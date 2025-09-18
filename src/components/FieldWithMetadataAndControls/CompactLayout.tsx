import { FC, ReactNode, memo } from 'react';
import classNames from 'classnames';
import { DuplicateGroup } from '@components/DuplicateGroup';
import { MarcTooltip } from '@components/MarcTooltip';

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
  marcMapping?: Record<string, string>;
};

export const CompactLayout: FC<ICompactLayout> = memo(
  ({
    children,
    entry,
    displayName,
    showLabel,
    labelContainerClassName,
    htmlId,
    hasDuplicateGroupButton,
    onClickDuplicateGroup,
    onClickDeleteGroup,
    marcMapping,
  }) => {
    const { deletable, marcMapping: entryMarcMapping } = entry;
    const selectedMarcMapping = marcMapping ?? entryMarcMapping;

    return (
      <>
        {displayName && showLabel && (
          <div id={htmlId} className={classNames('label', labelContainerClassName)}>
            {displayName}
          </div>
        )}
        <div className="children-container" data-testid={htmlId}>
          {children}
        </div>
        {selectedMarcMapping && <MarcTooltip mapping={selectedMarcMapping} htmlId={htmlId} className="field-tooltip" />}
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
