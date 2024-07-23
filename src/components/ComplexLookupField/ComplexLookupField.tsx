import { ChangeEvent, FC, useState } from 'react';
import CloseIcon from '@src/assets/times-16.svg?react';
import { Input } from '../Input';

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

  return (
    <>
      {layout ? (
        <div className="complex-lookup">
          {!!localValue.length && (
            <div className="complex-lookup-value">
              {localValue?.map(({ id, label }) => (
                <div key={id} className="complex-lookup-selected">
                  <span className="complex-lookup-selected-label">{label}</span>
                  <button onClick={() => handleDelete(id)} className="complex-lookup-selected-delete">
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="complex-lookup-select">
            <button className="complex-lookup-select-button">
              {localValue?.length > 0 ? layout?.selectTitle?.change : layout?.selectTitle?.base}
            </button>
          </div>
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
