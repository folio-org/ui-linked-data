import { FC, MouseEventHandler, ReactNode } from 'react';
import './Button.scss';
import classNames from 'classnames';

export enum ButtonType {
  Highlighted = 'highlighted',
  Secondary = 'secondary',
  Text = 'text',
  Link = 'link',
  Primary = 'primary',
  Passive = 'passive',
  Ghost = 'ghost',
  Icon = 'icon',
}

type Button = {
  id?: string;
  type?: ButtonType;
  label?: string | ReactNode;
  children?: string | ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | VoidFunction;
  className?: string;
  prefix?: string | ReactNode;
  disabled?: boolean;
  'data-testid'?: string;
};

export const Button: FC<Button> = ({
  id,
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
    id={id}
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
