import { ReactNode } from 'react';
import classNames from 'classnames';
import './ButtonGroup.scss';

type ButtonGroupProps = {
  className?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

export const ButtonGroup = ({ className, fullWidth, children }: ButtonGroupProps) => {
  return (
    <div role="tablist" className={classNames('button-group', { 'full-width': fullWidth }, className)}>
      {children}
    </div>
  );
};
