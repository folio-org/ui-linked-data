import { FC } from 'react';
import { MultiValueRemoveProps, components } from 'react-select';
import Times16 from '@src/assets/times-16.svg?react';
import './SimpleLookupField.scss';

export const MultiValueRemove: FC<MultiValueRemoveProps> = props => (
  <components.MultiValueRemove {...props}>
    <Times16 height="12" width="12" className="simple-lookup__multi-value__remove__icon" />
  </components.MultiValueRemove>
);
