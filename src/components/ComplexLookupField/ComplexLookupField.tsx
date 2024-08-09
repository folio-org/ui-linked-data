import { ChangeEvent, FC, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { useModalControls } from '@common/hooks/useModalControls';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { COMPLEX_LOOKUPS_CONFIG } from '@common/constants/complexLookup.constants';
import CloseIcon from '@src/assets/times-16.svg?react';
import { Row } from '@components/Table';
import { Input } from '@components/Input';
import { ModalComplexLookup } from './ModalComplexLookup';
import './ComplexLookupField.scss';

interface Props {
  uuid: string;
  entry: SchemaEntry;
  value?: UserValueContents[];
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

const __MOCK_URI_CHANGE_WHEN_IMPLEMENTING = '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING';
const VALUE_DIVIDER = ', ';

export const ComplexLookupField: FC<Props> = ({ value = undefined, uuid, entry, onChange }) => {
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value || []);
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { layout } = entry;
  // TODO: change the profile and entry and take the API endpoint from there
  const lookupConfig = COMPLEX_LOOKUPS_CONFIG['authorities'];
  const buttonLabelIds = lookupConfig.labels.button;

  const handleOnChangeBase = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      label: value,
      meta: {
        uri: __MOCK_URI_CHANGE_WHEN_IMPLEMENTING,
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue(prevValue => [...prevValue, newValue]);
  };

  const handleDelete = (id?: string) => {
    onChange(uuid, []);
    setLocalValue(prevValue => prevValue.filter(({ id: prevId }) => prevId !== id));
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // TODO: Implement the function to assign the value for Complex lookup subfield and for the linked subfield
  const onAssign = useCallback((row: Row) => {
    return row;
  }, []);

  const selectButtonLabel = <FormattedMessage id={localValue?.length ? buttonLabelIds.change : buttonLabelIds.base} />;

  return (
    <>
      {layout ? (
        <div className="complex-lookup">
          {!!localValue.length && (
            <div className="complex-lookup-value" data-testid="complex-lookup-value">
              {localValue?.map(({ id, label }) => (
                <div
                  key={id}
                  className={classNames([
                    'complex-lookup-selected',
                    IS_EMBEDDED_MODE && 'complex-lookup-selected-embedded',
                  ])}
                  data-testid="complex-lookup-selected"
                >
                  <span className="complex-lookup-selected-label" data-testid="complex-lookup-selected-label">
                    {label}
                  </span>
                  <button
                    role="button"
                    onClick={() => handleDelete(id)}
                    className="complex-lookup-selected-delete"
                    data-testid="complex-lookup-selected-delete"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button role="button" className="complex-lookup-select-button button-passive" onClick={openModal}>
            {selectButtonLabel}
          </button>

          <ModalComplexLookup
            isOpen={isModalOpen}
            onClose={closeModal}
            onAssign={onAssign}
            assignEntityName="authorities" // TODO: define value in the profile and pass it through the entry
            group="creator" // TODO: define value in the profile and pass it through the entry
          />
        </div>
      ) : (
        <Input
          onChange={handleOnChangeBase}
          value={localValue?.map(({ label }) => label).join(VALUE_DIVIDER) ?? ''}
          disabled={true}
          data-testid="complex-lookup-input"
        />
      )}
    </>
  );
};
