import type { SearchTypeConfig } from '../../core/types';
import type { SearchTypeUIConfig } from './ui.types';

/**
 * Flow types:
 * - 'url': Search driven by URL params (Search pages) - auto-executes on param changes
 * - 'value': Search driven by local state (Complex Lookup modals) - manual execution
 */
export type SearchFlow = 'url' | 'value';

/**
 * Rendering modes:
 * - 'auto': Context automatically renders all controls based on config
 * - 'custom': Client provides custom layout and uses individual compound components
 */
export type RenderMode = 'auto' | 'custom';

export interface CurrentSearchParams {
  query: string;
  searchBy: string;
  segment?: string;
  source?: string;
  offset: number;
  limit: number;
}

export interface SearchResults {
  items: unknown[];
  totalRecords: number;
  pageMetadata?: {
    totalElements: number;
    totalPages: number;
  };
}

export interface SearchContextValue {
  // Configuration (active atomic config for current segment)
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  flow: SearchFlow;
  mode: RenderMode;

  // Computed values
  activeUIConfig: SearchTypeUIConfig;

  // Search results (from React Query)
  results: SearchResults | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // Handlers
  onSegmentChange: (segment: string) => void;
  onSourceChange: (source: string) => void;
  onPageChange: (page: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export interface SearchProviderProps {
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  flow: SearchFlow;
  mode?: RenderMode;

  // Optional initial segment (composite key like "authorities:search")
  initialSegment?: string;
  initialSource?: string;

  children: React.ReactElement;
}
