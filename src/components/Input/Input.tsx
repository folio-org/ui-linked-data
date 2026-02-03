import { ChangeEvent, FC, HTMLInputTypeAttribute } from 'react';

import classNames from 'classnames';

import './Input.scss';

type InputProps = {
  id?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: VoidFunction;
  type?: HTMLInputTypeAttribute;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  role?: string;
  [x: string]: any;
};

export const Input: FC<InputProps> = ({
  id,
  placeholder,
  value = '',
  disabled = false,
  className,
  onChange,
  onPressEnter,
  type = 'text',
  ariaLabel,
  ariaLabelledBy,
  role = 'textbox',
  ...restProps
}) => {
  return (
    <input
      id={id}
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
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      role={role}
      {...restProps}
    />
  );
};
