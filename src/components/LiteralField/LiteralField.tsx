import { ChangeEvent, FC, useState } from 'react';
import { Input } from '@components/Input';

interface ILiteralField {
  uuid: string;
  value?: string;
  isDisabled?: boolean;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

export const LiteralField: FC<ILiteralField> = ({ uuid, value = '', isDisabled = false, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleOnChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(value);

    onChange(uuid, [{ label: value }]);
  };

  return (
    <Input
      className="edit-section-field-input"
      data-testid="literal-field"
      onChange={handleOnChange}
      value={localValue}
      disabled={isDisabled}
    />
  );
};
