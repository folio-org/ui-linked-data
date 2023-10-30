import { FC, useState } from 'react';
import Select from 'react-select';

export interface Props {
  options: ReactSelectOption[];
  name: string;
  uuid: string;
  onChange: (value: ReactSelectOption, fieldId: string, isDynamicField?: boolean) => void;
  value?: ReactSelectOption;
  isDisabled?: boolean;
}

export const DropdownField: FC<Props> = ({ options, name = '', uuid, onChange, value, isDisabled = false }) => {
  const [localValue, setLocalValue] = useState<ReactSelectOption | undefined>(value);

  const handleOnChange = (option: any) => {
    onChange(option, uuid, true);
    setLocalValue(option);
  };

  return (
    <div id={uuid} data-testid="dropdown-field">
      {name.trim() ? <div data-testid="dropdown-field-label">{name}</div> : null}
      <Select
        options={options}
        isSearchable={false}
        onChange={handleOnChange}
        value={localValue}
        isDisabled={isDisabled}
      />
    </div>
  );
};
