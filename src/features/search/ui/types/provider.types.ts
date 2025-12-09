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

/**
 * Segment configuration for dynamic mode.
 * Maps segment keys to their core config registry keys.
 */
export interface SegmentConfig {
  coreConfigKey: string;
  uiConfigKey?: string;
  defaultSource?: string;
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

/**
 * Static mode props - when providing explicit configs
 */
interface StaticModeProps {
  coreConfig: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  segments?: never;
}

/**
 * Dynamic mode props - when using registries for multi-segment search
 */
interface DynamicModeProps {
  segments: string[];
  defaultSegment?: string;
  defaultSource?: string;
  config?: never;
  uiConfig?: never;
}

/**
 * Base props shared by both modes
 */
interface BaseProviderProps {
  flow: SearchFlow;
  mode?: RenderMode;
  children: React.ReactNode;
}

export type SearchProviderProps = BaseProviderProps & (StaticModeProps | DynamicModeProps);
