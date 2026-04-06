import { AriaAttributes, FC, KeyboardEventHandler, MouseEventHandler, ReactNode, Ref } from 'react';

import classNames from 'classnames';

import './Button.scss';

export enum ButtonType {
  Highlighted = 'highlighted',
  Secondary = 'secondary',
  Text = 'text',
  Link = 'link',
  Primary = 'primary',
  Ghost = 'ghost',
  Icon = 'icon',
  ListItem = 'list-item',
}

type Button = {
  id?: string;
  type?: ButtonType;
  label?: string | ReactNode;
  children?: string | ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | VoidFunction;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement> | VoidFunction;
  className?: string;
  prefix?: string | ReactNode;
  disabled?: boolean;
  'data-testid'?: string;
  role?: string;
  ariaLabel?: string;
  ariaHaspopup?: AriaAttributes['aria-haspopup'];
  ariaExpanded?: boolean;
  tabbable?: boolean;
  ref?: Ref<HTMLButtonElement | null>;
};

export const Button: FC<Button> = ({
  id,
  prefix,
  label,
  children,
  onClick,
  onKeyDown,
  className = '',
  type = ButtonType.Primary,
  disabled,
  'data-testid': dataTestId,
  role,
  ariaLabel,
  ariaHaspopup,
  ariaExpanded,
  tabbable = true,
  ref,
}) => (
  <button
    id={id}
    ref={ref}
    data-testid={dataTestId}
    disabled={disabled}
    aria-disabled={disabled}
    onClick={onClick}
    onKeyDown={onKeyDown}
    role={role}
    aria-label={ariaLabel}
    aria-haspopup={ariaHaspopup}
    aria-expanded={ariaExpanded}
    tabIndex={tabbable ? 0 : -1}
    className={classNames('button', {
      [`button-${type}`]: type,
      [className]: className,
    })}
  >
    {prefix}
    {children || label}
  </button>
);
