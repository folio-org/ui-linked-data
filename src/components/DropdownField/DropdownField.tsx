import { FC, useEffect, useState } from 'react';
import { Select } from '@components/Select';

interface IDropdownField {
  entry: SchemaEntry;
  options: ReactSelectOption[];
  uuid: string;
  onChange: (value: ReactSelectOption, fieldId: string, isDynamicField?: boolean) => void;
  value?: ReactSelectOption;
  isDisabled?: boolean;
}

export const DropdownField: FC<IDropdownField> = ({ entry, options, uuid, onChange, value, isDisabled = false }) => {
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
      options={options}
      onChange={handleOnChange}
      value={localValue}
      disabled={isDisabled}
      className="edit-section-field-input dropdown-field"
      data-testid="dropdown-field"
    />
  );
};
