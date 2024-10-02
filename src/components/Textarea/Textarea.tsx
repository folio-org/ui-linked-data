import { FC, HTMLProps } from 'react';
import classNames from 'classnames';
import './Textarea.scss';

type TextareaProps = HTMLProps<HTMLTextAreaElement> & {
  'data-testid'?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
};

export const Textarea: FC<TextareaProps> = ({
  value,
  onChange,
  rows = 1,
  name = '',
  ariaLabel,
  id,
  className,
  'data-testid': dataTestId,
  fullWidth,
}) => {
  return (
    <textarea
      id={id}
      rows={rows}
      name={name}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      className={classNames('textarea', { 'textarea-full-width': fullWidth }, className)}
      data-testid={dataTestId}
    />
  );
};
