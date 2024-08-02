import { ChangeEvent, FC, useState } from 'react';
import classNames from 'classnames';
import { useModalControls } from '@common/hooks/useModalControls';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import CloseIcon from '@src/assets/times-16.svg?react';
import { Input } from '../Input';
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

  // TODO: should open a modal with current input value and search data using it
  const handleOnChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
            {localValue?.length ? layout?.selectTitle?.change : layout?.selectTitle?.base}
          </button>

          <ModalComplexLookup
            isOpen={isModalOpen}
            onClose={closeModal}
            title={layout?.selectTitle?.modal}
            // TODO: update the profile for taking the title from there
            searchPaneTitle={layout?.selectTitle?.modalControlPane || 'Authorities'}
          />
        </div>
      ) : (
        <Input
          onChange={handleOnChange}
          value={localValue?.map(({ label }) => label).join(VALUE_DIVIDER) ?? ''}
          disabled={true}
          data-testid="complex-lookup-input"
        />
      )}
    </>
  );
};
