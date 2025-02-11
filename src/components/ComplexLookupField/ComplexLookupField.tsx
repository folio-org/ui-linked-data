import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { VALUE_DIVIDER } from '@common/constants/complexLookup.constants';
import { SchemaControlType } from '@common/constants/uiControls.constants';
import { useComplexLookup } from '@common/hooks/useComplexLookup';
import { getHtmlIdForSchemaControl } from '@common/helpers/schema.helper';
import { COMPLEX_LOOKUPS_CONFIG } from '@src/configs';
import { Input } from '@components/Input';
import { ModalComplexLookup } from './ModalComplexLookup';
import { ComplexLookupSelectedItem } from './ComplexLookupSelectedItem';
import './ComplexLookupField.scss';

interface Props {
  entry: SchemaEntry;
  id?: string;
  value?: UserValueContents[];
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

export const ComplexLookupField: FC<Props> = ({ value = undefined, id, entry, onChange }) => {
  const { layout, htmlId } = entry;
  const lookupConfig = COMPLEX_LOOKUPS_CONFIG[layout?.api as string];
  const buttonConfigLabel = lookupConfig?.labels?.button;
  const noWarningField = lookupConfig?.ui?.noWarning?.fieldName;

  const { localValue, isModalOpen, openModal, closeModal, handleDelete, handleAssign, handleOnChangeBase } =
    useComplexLookup({
      entry,
      value,
      lookupConfig,
      authority: layout?.baseLabelType,
      onChange,
    });

  return (
    <>
      {layout?.isNew ? (
        <div id={id} className="complex-lookup">
          {!!localValue.length && (
            <div className="complex-lookup-value" data-testid="complex-lookup-value">
              {localValue?.map(({ id, label, meta }) => (
                <ComplexLookupSelectedItem
                  key={id}
                  id={id}
                  label={label}
                  handleDelete={handleDelete}
                  isPreferred={meta?.isPreferred}
                  noWarningField={noWarningField}
                />
              ))}
            </div>
          )}

          <button
            data-testid={getHtmlIdForSchemaControl(SchemaControlType.ChangeComplexFieldValue, id)}
            className="complex-lookup-select-button button-passive"
            onClick={openModal}
          >
            <FormattedMessage id={localValue?.length ? buttonConfigLabel?.change : buttonConfigLabel?.base} />
          </button>

          <ModalComplexLookup
            value={localValue?.[0]?.label}
            isOpen={isModalOpen}
            onClose={closeModal}
            onAssign={handleAssign}
            assignEntityName={layout.api}
            baseLabelType={layout.baseLabelType}
          />
        </div>
      ) : (
        <Input
          id={id}
          onChange={handleOnChangeBase}
          value={localValue?.map(({ label }) => label).join(VALUE_DIVIDER) ?? ''}
          disabled={true}
          data-testid="complex-lookup-input"
          ariaLabelledBy={htmlId}
        />
      )}
    </>
  );
};
