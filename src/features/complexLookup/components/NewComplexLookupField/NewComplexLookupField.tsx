import { FC, useState, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { VALUE_DIVIDER, ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';
import { SchemaControlType } from '@/common/constants/uiControls.constants';
import { getHtmlIdForSchemaControl } from '@/common/helpers/schema.helper';
import { logger } from '@/common/services/logger';
import { Input } from '@/components/Input';
import { getModalConfig, getButtonLabel } from '../../configs/modalRegistry';
import { ComplexLookupSelectedItem } from '../ComplexLookupSelectedItem';
import '../ComplexLookupField/ComplexLookupField.scss';

interface Props {
  entry: SchemaEntry;
  id?: string;
  value?: UserValueContents[];
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

/**
 * NewComplexLookupField - New implementation using modal registry and new Search architecture.
 * Modals are accessed only through the registry manager for centralized configuration.
 */
export const ComplexLookupField: FC<Props> = ({ value = undefined, id, entry, onChange }) => {
  const { layout, htmlId } = entry;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value ?? []);

  // Extract lookup type from schema
  const lookupType = layout?.api as ComplexLookupType;
  const isNewLayout = layout?.isNew ?? true;

  // Get modal configuration from registry
  const modalConfig = useMemo(() => {
    if (!lookupType) return null;

    try {
      return getModalConfig(lookupType);
    } catch (error) {
      logger.error('Failed to load modal config:', error);

      return null;
    }
  }, [lookupType]);

  const ModalComponent = modalConfig?.component;
  const modalDefaultProps = modalConfig?.defaultProps || {};

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value ?? []);
  }, [value]);

  // Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssign = (record: ComplexLookupAssignRecordDTO) => {
    // Update field value with assigned record
    const newValue = [
      {
        id: record.id,
        label: record.title,
        meta: {},
      },
    ];

    setLocalValue(newValue);
    onChange(entry.uuid, newValue);
    handleCloseModal();
  };

  const handleDelete = (id?: string) => {
    if (!id) return;

    const newValue = localValue.filter(value => value.id !== id);

    setLocalValue(newValue);
    onChange(entry.uuid, newValue);
  };

  // Get button label using registry
  const getButtonLabelId = () => {
    if (!lookupType) return 'ld.add';

    return getButtonLabel(lookupType, !!localValue?.length);
  };

  // Old layout - read-only input (kept for backward compatibility)
  if (!isNewLayout) {
    return (
      <Input
        id={id}
        value={
          localValue
            ?.filter(({ label }) => label)
            .map(({ label }) => label)
            .join(VALUE_DIVIDER) ?? ''
        }
        disabled={true}
        data-testid="complex-lookup-input"
        ariaLabelledBy={htmlId}
      />
    );
  }

  // New layout - interactive with modal
  return (
    <div id={id} className="complex-lookup">
      {/* Display selected items */}
      {!!localValue.length && (
        <div className="complex-lookup-value" data-testid="complex-lookup-value">
          {localValue
            ?.filter(value => value)
            .map(item => (
              <ComplexLookupSelectedItem
                key={item.id}
                id={item.id}
                label={item.label}
                handleDelete={handleDelete}
                noWarningValue={item.meta?.isPreferred}
              />
            ))}
        </div>
      )}

      {/* Button to open modal */}
      <button
        data-testid={getHtmlIdForSchemaControl(SchemaControlType.ChangeComplexFieldValue, id)}
        className="complex-lookup-select-button button-passive"
        onClick={handleOpenModal}
      >
        <FormattedMessage id={getButtonLabelId()} />
      </button>

      {/* Render modal using registry-based component */}
      {ModalComponent && (
        <ModalComponent
          {...{
            isOpen: isModalOpen,
            onClose: handleCloseModal,
            onAssign: handleAssign,
            initialQuery: localValue?.[0]?.label,
            ...modalDefaultProps,
            baseLabelType: layout?.baseLabelType,
          }}
        />
      )}
    </div>
  );
};
