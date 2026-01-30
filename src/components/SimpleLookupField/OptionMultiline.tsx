import { FC } from 'react';
import { OptionProps, components } from 'react-select';

import './SimpleLookupField.scss';

export const OptionMultiline: FC<OptionProps> = props => {
  const { label, subLabel } = props.data as MultiselectOption;

  return (
    <components.Option {...props}>
      <div className="select-option-label">{label}</div>
      <div className="select-option-sebLabel">{subLabel}</div>
    </components.Option>
  );
};
