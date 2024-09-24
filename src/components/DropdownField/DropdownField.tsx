import { FC, useEffect, useState } from 'react';
import { Select } from '@components/Select';

interface IDropdownField {
  options: ReactSelectOption[];
  uuid: string;
  onChange: (value: ReactSelectOption, fieldId: string, isDynamicField?: boolean) => void;
  value?: ReactSelectOption;
  isDisabled?: boolean;
  id?: string;
  'data-testid'?: string;
}

export const DropdownField: FC<IDropdownField> = ({
  options,
  uuid,
  id,
  onChange,
  value,
  isDisabled = false,
  'data-testid': testId = 'dropdown-field',
}) => {
  const [localValue, setLocalValue] = useState<ReactSelectOption | undefined>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleOnChange = (option: any) => {
    onChange(option, uuid, true);
    setLocalValue(option);
  };

  return (
    <Select
      id={id}
      options={options}
      onChange={handleOnChange}
      value={localValue}
      disabled={isDisabled}
      className="edit-section-field-input dropdown-field"
      data-testid={testId}
    />
  );
};
