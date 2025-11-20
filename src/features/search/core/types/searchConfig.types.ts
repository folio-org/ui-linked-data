import { RequestBuilder, ResponseTransformer, ResultFormatter } from './strategies.types';

// Search strategies
export interface SearchStrategies {
  requestBuilder?: RequestBuilder;
  responseTransformer?: ResponseTransformer;
  resultFormatter?: ResultFormatter;
}

// SearhcBy config
export interface SearchableIndex {
  value: string;
  labelId: string;
  placeholder?: string;
}

export interface SearchByConfig {
  searchableIndices: SearchableIndex[];
}

// UI
export interface UIConfig {
  titleId?: string;
  subtitleId?: string;
  placeholderId?: string;
  emptyStateId?: string;
}

export interface FeaturesConfig {
  // Search input features
  hasSearchBy?: boolean;
  hasMultilineInput?: boolean;
  hasAdvancedSearch?: boolean;

  // Display features
  isVisiblePaginationCount?: boolean;
  isLoopedPagination?: boolean;
  isVisibleSubLabel?: boolean;

  // Functionality features
  hasFilters?: boolean;
  hasPagination?: boolean;
  paginationLimit?: number;
}

// Base config (Shared properties)
export interface BaseConfig {
  type: string;

  // Strategy for this config level
  strategies?: SearchStrategies;

  // Search configuration
  searchBy?: SearchByConfig;

  // UI configuration
  ui?: UIConfig;

  // Features
  features?: FeaturesConfig;
}

// Sources ('internal' | 'external')
export interface SourceConfig {
  type: string;

  // API Strategies configuration specific to this source
  strategies?: SearchStrategies;
}

// Segments ('Resources' | 'Hubs')
export interface SegmentConfig extends BaseConfig {
  type: string;

  // Nested segments (Subject: Authorities/Hubs -> Authorities -> Search/Browse)
  segments?: Record<string, SegmentConfig>;

  // Sources specific to this segment
  sources?: Record<string, SourceConfig>;
}

export interface SearchConfig {
  // Option 1: Direct strategy (simplest case - Resources)
  strategies?: SearchStrategies;
  searchBy?: SearchByConfig;
  ui?: UIConfig;
  features?: FeaturesConfig;

  // Option 2: Segments (Authorities: Search/Browse)
  segments?: Record<string, SegmentConfig>;

  // Option 3: Sources (Hubs: Internal/External)
  sources?: Record<string, SourceConfig>;

  // Default values
  defaults?: {
    segment?: string;
    source?: string;
    searchBy?: string;
    query?: string;
    limit?: number;
    offset?: number;
  };
}
