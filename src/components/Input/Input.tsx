import { ChangeEvent, FC } from 'react';
import './Input.scss';

type InputProps = {
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({ placeholder, value, disabled = false, onChange }) => {
  return <input className="input" value={value} placeholder={placeholder} onChange={onChange} disabled={disabled} />;
};
