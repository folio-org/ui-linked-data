import classNames from 'classnames';
import { ChangeEvent, FC, HTMLInputTypeAttribute } from 'react';
import './Input.scss';

type InputProps = {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  testid?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: VoidFunction;
  type?: HTMLInputTypeAttribute;
};

export const Input: FC<InputProps> = ({
  placeholder,
  value = '',
  disabled = false,
  className,
  testid,
  onChange,
  onPressEnter,
  type = 'text',
}) => {
  return (
    <input
      data-testid={testid}
      className={classNames('input', className)}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      onKeyDown={({ key, target }) => {
        if ((key === 'Enter' || key == 'NumpadEnter') && onPressEnter) {
          onPressEnter();

          (target as HTMLElement).blur();
        }
      }}
      type={type}
    />
  );
};
