import { ComponentPropsWithoutRef } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import CaretDown16 from '@/assets/triangle-down-16.svg?react';

import './Select.scss';

export type SelectValue = {
  value: string;
  label?: string;
  isDisabled?: boolean;
};

type SelectProps<T extends SelectValue = SelectValue> = Omit<
  ComponentPropsWithoutRef<'select'>,
  'value' | 'onChange'
> & {
  value?: string | T;
  onChange: (item: T) => void;
  options: (string | T)[];
  withIntl?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
};

export function Select<T extends SelectValue = SelectValue>({
  id,
  value,
  onChange,
  options,
  withIntl = false,
  className,
  ariaLabel,
  ariaLabelledBy,
  ...restProps
}: SelectProps<T>) {
  const selectedValue = typeof value === 'string' ? value : value?.value;

  return (
    <div className="select-wrapper">
      <select
        id={id}
        className={classNames('select-input', className, { placeholder: selectedValue === '' })}
        value={selectedValue}
        onChange={({ target: { value } }) => {
          const selectedValue = options.find(item =>
            typeof item === 'string' ? item === value : item.value === value,
          );

          if (selectedValue) {
            onChange((typeof selectedValue === 'string' ? { value: selectedValue } : selectedValue) as T);
          }
        }}
        role="combobox"
        aria-expanded="false"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
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
      <span className="select-icon" aria-hidden="true">
        <CaretDown16 />
      </span>
    </div>
  );
}
