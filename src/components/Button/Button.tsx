import { FC, MouseEventHandler } from 'react';
import './Button.scss';
import classNames from 'classnames';

export enum ButtonType {
  Highlighted = 'highlighted',
  Secondary = 'secondary',
  Text = 'text',
  Link = 'link',
  Primary = 'primary',
  Passive = 'passive'
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
  type = ButtonType.Passive,
  disabled,
  'data-testid': dataTestId,
}) => (
  <button
    data-testid={dataTestId}
    disabled={disabled}
    onClick={onClick}
    className={classNames('button', {
      [`button-${type}`]: type,
      [className]: className,
    })}
  >
    <>
      {prefix && prefix}
      {children || label}
    </>
  </button>
);
