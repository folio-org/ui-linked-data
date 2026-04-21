import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

import './DatePicker.scss';

type DatePickerProps = {
  id: string;
  ['data-testid']?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void | Dispatch<SetStateAction<string>>;
};

export const DatePicker: FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  name,
  placeholder,
  'data-testid': dataTestId,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="date-picker">
      <input
        id={id}
        data-testid={dataTestId ?? `date-picker-input-${id}`}
        type="date"
        className="date-picker-input"
        value={value}
        onChange={handleChange}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};
