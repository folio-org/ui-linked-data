import { FC } from 'react';
import { ClearIndicatorProps, components } from 'react-select';

import Times16 from '@/assets/times-16.svg?react';

import './SimpleLookupField.scss';

export const ClearIndicator: FC<ClearIndicatorProps> = props => (
  <components.ClearIndicator {...props}>
    <Times16 height="12" width="12" className="simple-lookup__clear-indicator__icon" />
  </components.ClearIndicator>
);
