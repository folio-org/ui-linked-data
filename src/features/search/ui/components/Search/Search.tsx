import { FC } from 'react';

import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';

import { SearchProvider } from '../../providers/SearchProvider';
import type { SearchProviderProps } from '../../types/provider.types';

export const Search: FC<SearchProviderProps> = props => {
  const { children } = props;

  // Minimal sanity check for dynamic mode
  if ('segments' in props && Array.isArray(props.segments) && props.segments.length === 0) {
    return null;
  }

  // Static mode validation: ensure both coreConfig and uiConfig are provided
  if ('coreConfig' in props && (!props.coreConfig || !props.uiConfig)) {
    return null;
  }

  return (
    <SearchProvider {...props}>
      <div data-testid="id-search" className={DOM_ELEMENTS.classNames.itemSearch}>
        {children}
      </div>
    </SearchProvider>
  );
};
