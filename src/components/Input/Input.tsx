import classNames from 'classnames';
import { ChangeEvent, FC, HTMLInputTypeAttribute } from 'react';
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
      {...restProps}
    />
  );
};
