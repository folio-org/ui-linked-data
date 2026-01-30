import { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { checkRepeatableGroup, checkRepeatableSubcomponent } from '@/common/helpers/repeatableFields.helper';
import { useProfileSchema } from '@/common/hooks/useProfileSchema';

import { useInputsState, useProfileState } from '@/store';

import { CompactLayout } from './CompactLayout';
import { ExtendedLayout } from './ExtendedLayout';

import './FieldWithMetadataAndControls.scss';

type IFieldWithMetadataAndControls = {
  entry: SchemaEntry;
  children?: ReactNode;
  isCompact?: boolean;
  className?: string;
  labelContainerClassName?: string;
  level?: number;
  disabled?: boolean;
  showLabel?: boolean;
  marcMapping?: Record<string, string>;
  [x: string]: any;
};

export const FieldWithMetadataAndControls: FC<IFieldWithMetadataAndControls> = ({
  children,
  isCompact = false,
  entry,
  className,
  labelContainerClassName,
  level,
  showLabel = true,
  disabled = false,
  marcMapping,
  ...restProps
}) => {
  const { schema } = useProfileState(['schema']);
  const { selectedEntries } = useInputsState(['selectedEntries']);
  const { updateSchemaWithCopiedEntries, updateSchemaWithDeletedEntries } = useProfileSchema();
  const { uuid, displayName, htmlId } = entry;

  const hasDuplicateGroupButton = checkRepeatableGroup({ schema, entry, level, isDisabled: disabled });
  const hasDuplicateSubcomponentButton = checkRepeatableSubcomponent({ entry, isDisabled: disabled });

  const onClickDuplicateGroup = () => {
    updateSchemaWithCopiedEntries(entry, selectedEntries);
  };

  const onClickDeleteGroup = () => {
    updateSchemaWithDeletedEntries(entry);
  };

  const commonLayoutProps = {
    entry,
    displayName,
    showLabel,
    htmlId,
    labelContainerClassName,
    hasDuplicateGroupButton,
    hasDuplicateSubcomponentButton,
    onClickDuplicateGroup,
    onClickDeleteGroup,
  };

  return (
    <div
      className={classNames(
        'field-with-meta-controls-container',
        { 'field-with-meta-controls-container-extended': !isCompact && hasDuplicateGroupButton },
        { 'field-hidden-by-settings': !entry.editorVisible },
        { 'field-visible-by-drift': entry.profileSettingsDrift },
        className,
      )}
      id={uuid}
      data-testid={`field-with-meta-controls-${uuid}`}
      {...restProps}
    >
      {isCompact ? (
        <CompactLayout {...commonLayoutProps} marcMapping={marcMapping}>
          {children}
        </CompactLayout>
      ) : (
        <ExtendedLayout {...commonLayoutProps} marcMapping={marcMapping}>
          {children}
        </ExtendedLayout>
      )}
    </div>
  );
};
