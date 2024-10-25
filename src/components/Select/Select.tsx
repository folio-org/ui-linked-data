import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import './Select.scss';

type SelectValue = {
  value: string;
  label?: string;
  isDisabled?: boolean;
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
  const selectedValue = typeof value === 'string' ? value : value?.value;

  return (
    <select
      id={id}
      className={classNames('select-input', className, {placeholder: selectedValue === ''})}
      value={selectedValue}
      onChange={({ target: { value } }) => {
        const selectedValue = options.find(item => (typeof item === 'string' ? item === value : item.value === value));

        selectedValue && onChange(typeof selectedValue === 'string' ? { value: selectedValue } : selectedValue);
      }}
      {...restProps}
    >
      {options.map(id => {
        const [optionValue, optionLabel, isDisabled] =
          typeof id === 'string' ? [id, id] : [id.value, id.label, id.isDisabled];

        return (
          <option key={optionValue} value={optionValue} data-testid={optionValue} disabled={isDisabled || false}>
            {withIntl ? <FormattedMessage id={`ld.${optionLabel}`} /> : optionLabel}
          </option>
        );
      })}
    </select>
  );
};
