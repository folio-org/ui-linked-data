import { ChangeEvent, FC, useState } from 'react';
import { Input } from '../Input';

interface Props {
  label: string;
  uuid: string;
  value?: UserValueContents;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

const __MOCK_URI_CHANGE_WHEN_IMPLEMENTING = '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING';

export const ComplexLookupField: FC<Props> = ({ label = '', value = undefined, uuid, onChange }) => {
  const [localValue, setLocalValue] = useState<UserValueContents>(value || {});

  // TODO: should open a modal with current input value and search data using it
  const handleOnChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      label: value,
      meta: {
        uri: __MOCK_URI_CHANGE_WHEN_IMPLEMENTING,
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue(newValue);
  };

  return (
    <div id={uuid} data-testid="complex-lookup">
      {label.length > 0 && <div>{label}</div>}
      <Input
        placeholder={label}
        onChange={handleOnChange}
        value={localValue?.label ?? ''}
        disabled={true}
        testid="complex-lookup-input"
      />
    </div>
  );
};
