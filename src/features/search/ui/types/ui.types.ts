// UI presentation config
export interface SearchUIConfig {
  titleId?: string;
  subtitleId?: string;
  placeholderId?: string;
  emptyStateId?: string;
}

// UI features (display/interaction concerns)
export interface SearchUIFeatures {
  // Search input UI
  hasSearchBy?: boolean;
  hasMultilineInput?: boolean;
  hasAdvancedSearch?: boolean;

  // Display features
  isVisiblePaginationCount?: boolean;
  isLoopedPagination?: boolean;
  isVisibleSubLabel?: boolean;
}

// Searchable index with UI properties
export interface SearchableIndexUI {
  value: string;
  labelId: string;
  placeholder?: string; // UI-specific
}

// Complete UI configuration for a search type
export interface SearchTypeUIConfig {
  ui?: SearchUIConfig;
  features?: SearchUIFeatures;
  searchableIndices?: SearchableIndexUI[];
}
