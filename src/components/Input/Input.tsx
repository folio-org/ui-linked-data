import { FC, ChangeEvent } from 'react';

type InputProps = {
  placeholder?: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({ placeholder, value, onChange }) => {
  return <input value={value} placeholder={placeholder} onChange={onChange} />;
};
