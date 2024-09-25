import classNames from 'classnames';
import './ButtonGroup.scss';
import { ReactNode } from 'react';

type ButtonGroupProps = {
  className?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

export const ButtonGroup = ({ className, fullWidth, children }: ButtonGroupProps) => {
  return <div className={classNames('button-group', { 'full-width': fullWidth }, className)}>{children}</div>;
};
