import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import './Select.scss';
import classNames from 'classnames';

type SelectValue = {
  value: string;
  label?: string;
  [x: string]: any;
};

type Select = {
  id?: string;
  value?: string | SelectValue;
  onChange: (item: SelectValue) => void;
  options: (string | SelectValue)[];
  withIntl?: boolean;
  className?: string;
  [x: string]: any;
};

export const Select: FC<Select> = ({ id, value, onChange, options, withIntl = false, className, ...restProps }) => {
  return (
    <select
      id={id}
      className={classNames('select-input', className)}
      value={typeof value === 'string' ? value : value?.value}
      onChange={({ target: { value } }) => {
        const selectedValue = options.find(item => (typeof item === 'string' ? item === value : item.value === value));

        selectedValue && onChange(typeof selectedValue === 'string' ? { value: selectedValue } : selectedValue);
      }}
      {...restProps}
    >
      {options.map(id => {
        const [optionValue, optionLabel] = typeof id === 'string' ? [id, id] : [id.value, id.label];

        return (
          <option key={optionValue} value={optionValue} data-testid={optionValue}>
            {withIntl ? <FormattedMessage id={`marva.${optionLabel}`} /> : optionLabel}
          </option>
        );
      })}
    </select>
  );
};
