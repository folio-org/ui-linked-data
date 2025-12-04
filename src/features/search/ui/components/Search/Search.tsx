import { FC, ReactNode } from 'react';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { SearchProvider } from '../../providers/SearchProvider';
import type { SearchTypeConfig } from '../../../core/types';
import type { SearchTypeUIConfig } from '../../types/ui.types';
import type { SearchFlow } from '../../types/provider.types';

interface StaticSearchProps {
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  segments?: never;
  defaultSegment?: never;
  defaultSource?: never;
}

interface DynamicSearchProps {
  segments: string[];
  defaultSegment?: string;
  defaultSource?: string;
  config?: never;
  uiConfig?: never;
}

interface BaseSearchProps {
  flow: SearchFlow;
  mode?: 'auto' | 'custom';
  children: ReactNode;
}

export type SearchRootProps = BaseSearchProps & (StaticSearchProps | DynamicSearchProps);

function isDynamicMode(props: SearchRootProps): props is BaseSearchProps & DynamicSearchProps {
  return 'segments' in props && Array.isArray(props.segments);
}

export const Search: FC<SearchRootProps> = props => {
  const { flow, mode = 'custom', children } = props;

  // Validate required props based on mode
  if (isDynamicMode(props)) {
    if (props.segments.length === 0) {
      return null;
    }
  } else if (!props.config || !props.uiConfig) {
    return null;
  }

  const providerProps = isDynamicMode(props)
    ? {
        segments: props.segments,
        defaultSegment: props.defaultSegment,
        defaultSource: props.defaultSource,
        flow,
        mode,
      }
    : {
        config: props.config,
        uiConfig: props.uiConfig,
        flow,
        mode,
      };

  return (
    <SearchProvider {...providerProps}>
      <div data-testid="id-search" className={DOM_ELEMENTS.classNames.itemSearch}>
        {children}
      </div>
    </SearchProvider>
  );
};
