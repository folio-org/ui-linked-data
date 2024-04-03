import { FC } from 'react';
import { DropdownIndicatorProps, components } from 'react-select';
import Caret from '@src/assets/dropdown-caret.svg?react';

export const DropdownIndicator: FC<DropdownIndicatorProps> = props => (
  <components.DropdownIndicator {...props}>
    <Caret className="simple-lookup__dropdown-indicator__icon" />
  </components.DropdownIndicator>
);
