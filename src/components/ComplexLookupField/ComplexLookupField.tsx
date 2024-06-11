import { ChangeEvent, FC, useState } from 'react';
import { Input } from '../Input';

interface Props {
  uuid: string;
  value?: UserValueContents[];
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

const __MOCK_URI_CHANGE_WHEN_IMPLEMENTING = '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING';
const VALUE_DIVIDER = ', ';

export const ComplexLookupField: FC<Props> = ({ value = undefined, uuid, onChange }) => {
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value || [{}]);

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

  return (
    <Input
      onChange={handleOnChange}
      value={localValue?.map(({ label }) => label).join(VALUE_DIVIDER) ?? ''}
      disabled={true}
      data-testid="complex-lookup-input"
    />
  );
};
