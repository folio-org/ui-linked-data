import classNames from 'classnames';
import './ButtonGroup.scss';

type ButtonGroupProps = {
  className?: string;
  fullWidth?: boolean;
  children: ReactElement[];
};

export const ButtonGroup = ({ className, fullWidth, children }: ButtonGroupProps) => {
  return <div className={classNames('button-group', { 'full-width': fullWidth }, className)}>{children}</div>;
};
