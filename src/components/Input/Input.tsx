import { ChangeEvent, FC } from 'react';
import './Input.scss';

type InputProps = {
  placeholder?: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({ placeholder, value, onChange }) => {
  return <input className="input" value={value} placeholder={placeholder} onChange={onChange} />;
};
