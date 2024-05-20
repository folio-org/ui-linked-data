import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { useProfileSchema } from '@common/hooks/useProfileSchema';
import { useRecoilState, useRecoilValue } from 'recoil';
import state from '@state';
import { checkRepeatableGroup, checkRepeatableSubcomponent } from '@common/helpers/repeatableFields.helper';
import { CompactLayout } from './CompactLayout';
import { ExtendedLayout } from './ExtendedLayout';
import './FieldWithMetadataAndControls.scss';

type IFieldWithMetadataAndControls = {
  entry: SchemaEntry;
  children: ReactNode;
  isCompact?: boolean;
  className?: string;
  labelContainerClassName?: string;
  level?: number;
  disabled?: boolean;
  showLabel?: boolean;
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
  ...restProps
}) => {
  const [schema, setSchema] = useRecoilState(state.config.schema);
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const { getSchemaWithCopiedEntries } = useProfileSchema();
  const { uuid, displayName } = entry;

  const hasDuplicateGroupButton = checkRepeatableGroup({ schema, entry, level, isDisabled: disabled });
  const hasDuplicateSubcomponentButton = checkRepeatableSubcomponent({ schema, entry, isDisabled: disabled });

  const onClickDuplicateGroup = () => {
    const updatedSchema = getSchemaWithCopiedEntries(schema, entry, selectedEntries);

    setSchema(updatedSchema);
  };

  const commonLayoutProps = {
    displayName,
    showLabel,
    labelContainerClassName,
    hasDuplicateGroupButton,
    hasDuplicateSubcomponentButton,
    onClickDuplicateGroup,
  };

  return (
    <div
      className={classNames(
        'field-with-meta-controls-container',
        { 'field-with-meta-controls-container-extended': !isCompact && hasDuplicateGroupButton },
        className,
      )}
      id={uuid}
      data-testid={`field-with-meta-controls-${uuid}`}
      {...restProps}
    >
      {isCompact ? (
        <CompactLayout {...commonLayoutProps}>{children}</CompactLayout>
      ) : (
        <ExtendedLayout entry={entry} {...commonLayoutProps}>
          {children}
        </ExtendedLayout>
      )}
    </div>
  );
};
