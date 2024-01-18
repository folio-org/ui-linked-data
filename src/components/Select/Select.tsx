import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import './Select.scss';
import classNames from 'classnames';

type Select = {
  id?: string;
  value?: string;
  onChange: ({ value }: { value: string }) => void;
  options: string[];
  className?: string;
};

export const Select: FC<Select> = ({ id, value, onChange, options, className }) => {
  return (
    <select
      id={id}
      className={classNames('select-input', className)}
      value={value}
      onChange={({ target: { value } }) => onChange({ value })}
    >
      {options.map(id => (
        <option key={id} value={id} data-testid={id}>
          <FormattedMessage id={`marva.${id}`} />
        </option>
      ))}
    </select>
  );
};
