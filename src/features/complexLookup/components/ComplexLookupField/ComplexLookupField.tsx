import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';
import { SchemaControlType } from '@/common/constants/uiControls.constants';
import { getHtmlIdForSchemaControl } from '@/common/helpers/schema.helper';
import { Input } from '@/components/Input';
import { useComplexLookupField } from '../../hooks';
import { formatComplexLookupDisplayValue } from '../../utils';
import { ComplexLookupSelectedItem } from '../ComplexLookupSelectedItem';
import './ComplexLookupField.scss';

interface Props {
  entry: SchemaEntry;
  id?: string;
  value?: UserValueContents[];
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

/**
 * ComplexLookupField - New implementation using modal registry and new Search architecture.
 * Modals are accessed only through the registry manager for centralized configuration.
 */
export const ComplexLookupField: FC<Props> = ({ value = undefined, id, entry, onChange }) => {
  const { layout, htmlId } = entry;
  const lookupType = layout?.api as ComplexLookupType | undefined;
  const isNewLayout = layout?.isNew ?? false;

  const {
    localValue,
    isModalOpen,
    modalConfig,
    buttonLabelId,
    handleOpenModal,
    handleCloseModal,
    handleAssign,
    handleDelete,
  } = useComplexLookupField({
    value,
    lookupType,
    uuid: entry.uuid,
    onChange,
  });

  const ModalComponent = modalConfig?.component;
  const modalDefaultProps = modalConfig?.defaultProps || {};

  // Old layout - read-only input (kept for backward compatibility)
  if (!isNewLayout) {
    return (
      <Input
        id={id}
        value={formatComplexLookupDisplayValue(localValue)}
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
          {localValue.map(({ id, label, meta }) => (
            <ComplexLookupSelectedItem
              key={id}
              id={id}
              label={label}
              handleDelete={handleDelete}
              noWarningValue={meta?.isPreferred}
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
        <FormattedMessage id={buttonLabelId} />
      </button>

      {/* Render modal using registry-based component */}
      {ModalComponent && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAssign={handleAssign}
          initialQuery={localValue?.[0]?.label}
          {...modalDefaultProps}
        />
      )}
    </div>
  );
};
