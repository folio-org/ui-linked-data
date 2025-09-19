import { FC, ReactNode, memo } from 'react';
import classNames from 'classnames';
import { DuplicateGroup } from '@components/DuplicateGroup';
import { MarcTooltip } from '@components/MarcTooltip';
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
  onClickDeleteGroup?: VoidFunction;
  marcMapping?: Record<string, string>;
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
    onClickDeleteGroup,
    marcMapping,
  }) => {
    const { type, deletable, marcMapping: entryMarcMapping } = entry;
    const selectedMarcMapping = marcMapping ?? entryMarcMapping;

    return (
      <>
        <div id={htmlId} className={classNames({ 'extended-layout-meta': hasDuplicateGroupButton || marcMapping })}>
          {displayName && showLabel && (
            <div className={classNames('label', labelContainerClassName)}>{displayName}</div>
          )}
          <div className="controls-container">
            {selectedMarcMapping && (
              <MarcTooltip mapping={selectedMarcMapping} htmlId={htmlId} className="field-tooltip" />
            )}
            {hasDuplicateGroupButton && (
              <DuplicateGroup
                htmlId={htmlId}
                deleteDisabled={!deletable}
                onClickDuplicate={onClickDuplicateGroup}
                onClickDelete={onClickDeleteGroup}
              />
            )}
          </div>
        </div>
        {children && (
          <div className="children-container" data-testid={htmlId}>
            {(type === AdvancedFieldType.dropdown || type === AdvancedFieldType.enumerated) &&
              hasDuplicateGroupButton && (
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
            onClickDuplicate={onClickDuplicateGroup}
            hasDeleteButton={false}
            className="duplicate-subcomponent"
          />
        )}
      </>
    );
  },
);
