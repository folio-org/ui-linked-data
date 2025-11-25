import { FC, ReactNode } from 'react';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { SearchProvider } from '../../providers/SearchProvider';
import type { SearchTypeConfig } from '../../../core/types';
import type { SearchTypeUIConfig } from '../../types/ui.types';
import type { SearchFlow } from '../../types/provider.types';

interface SearchRootProps {
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  flow: SearchFlow;
  mode?: 'auto' | 'custom';
  initialSegment?: string;
  children: ReactNode;
}

export const Search: FC<SearchRootProps> = ({ config, uiConfig, flow, mode = 'custom', initialSegment, children }) => {
  return (
    <SearchProvider config={config} uiConfig={uiConfig} flow={flow} mode={mode} initialSegment={initialSegment}>
      <div data-testid="id-search" className={DOM_ELEMENTS.classNames.itemSearch}>
        {children}
      </div>
    </SearchProvider>
  );
};
