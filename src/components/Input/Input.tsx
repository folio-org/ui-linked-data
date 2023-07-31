import classNames from 'classnames';
import { ChangeEvent, FC } from 'react';
import './Input.scss';

type InputProps = {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  testid?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({ placeholder, value = '', disabled = false, className, testid, onChange }) => (
  <input
    data-testid={testid}
    className={classNames('input', className)}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    disabled={disabled}
  />
);
