import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import './DatePicker.scss';

type DatePickerProps = {
  id: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void | Dispatch<SetStateAction<string>>;
};

export const DatePicker: FC<DatePickerProps> = ({ id, value, onChange, name, placeholder }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="date-picker">
      <input
        id={id}
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
