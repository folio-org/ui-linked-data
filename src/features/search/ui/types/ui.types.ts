// UI presentation config
export interface SearchUIConfig {
  titleId?: string;
  subtitleId?: string;
  placeholderId?: string;
  emptyStateId?: string;
  noResultsId?: string;
}

// UI features (display/interaction concerns)
export interface SearchUIFeatures {
  // Navigation features
  hasSegments?: boolean;
  hasSourceToggle?: boolean;

  // Search input UI
  hasSearchBy?: boolean;
  hasQueryInput?: boolean;
  hasMultilineInput?: boolean;
  hasAdvancedSearch?: boolean;
  hasSubmitButton?: boolean;

  // Display features
  isVisiblePaginationCount?: boolean;
  isLoopedPagination?: boolean;
  isVisibleSubLabel?: boolean;
  isVisibleEmptySearchPlaceholder?: boolean;
}

// Searchable index with UI properties
export interface SearchableIndexUI {
  value: string;
  labelId: string;
  placeholder?: string; // UI-specific
}

export interface SegmentUIConfig {
  ui?: SearchUIConfig;
  features?: SearchUIFeatures;
  searchableIndices?: SearchableIndexUI[];
  limit?: number;
}

// UI config for a search type
export interface SearchTypeUIConfig {
  ui?: SearchUIConfig;
  features?: SearchUIFeatures;
  searchableIndices?: SearchableIndexUI[];
  limit?: number;
  segments?: Record<string, SegmentUIConfig>;
}
