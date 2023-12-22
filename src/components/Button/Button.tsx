import { FC, MouseEventHandler } from 'react';
import './Button.scss';
import classNames from 'classnames';

export enum ButtonType {
  Primary,
  Secondary,
  Text,
  Link,
}

type Button = {
  type?: ButtonType;
  label?: string | JSX.Element;
  children?: string | JSX.Element;
  onClick?: MouseEventHandler<HTMLButtonElement> | VoidFunction;
  className?: string;
  prefix?: string | JSX.Element;
  disabled?: boolean;
  'data-testid'?: string;
};

export const Button: FC<Button> = ({
  prefix,
  label,
  children,
  onClick,
  className = '',
  type = ButtonType.Secondary,
  disabled,
  'data-testid': dataTestId,
}) => (
  <button
    data-testid={dataTestId}
    disabled={disabled}
    onClick={onClick}
    className={classNames('button', {
      'button-secondary': type === ButtonType.Secondary,
      'button-primary': type === ButtonType.Primary,
      'button-text': type === ButtonType.Text,
      'button-link': type === ButtonType.Link,
      [className]: className,
    })}
  >
    <>
      {prefix && prefix}
      {children || label}
    </>
  </button>
);
