import { ChangeEvent, FC, useState } from 'react';

import { Input } from '@/components/Input';

interface ILiteralField {
  uuid: string;
  htmlId?: string;
  value?: string;
  isDisabled?: boolean;
  id?: string;
  placeholder?: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
  'data-testid'?: string;
}

export const LiteralField: FC<ILiteralField> = ({
  uuid,
  htmlId,
  value = '',
  id,
  placeholder,
  isDisabled = false,
  onChange,
  'data-testid': testId = 'literal-field',
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleOnChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(value);

    onChange(uuid, [{ label: value }]);
  };

  return (
    <Input
      id={id}
      className="edit-section-field-input"
      data-testid={testId}
      onChange={handleOnChange}
      value={localValue}
      disabled={isDisabled}
      placeholder={placeholder}
      ariaLabelledBy={htmlId}
    />
  );
};
