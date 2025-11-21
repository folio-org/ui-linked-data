import type { SearchableIndexUI, SearchTypeUIConfig } from '../types';

//Authorities Search UI Configuration
export const authoritiesUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: '',
    subtitleId: '',
    placeholderId: '',
  },
  features: {
    hasSearchBy: true,
    hasMultilineInput: false,
    hasAdvancedSearch: false,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: false,
  },
  searchableIndices: [] as SearchableIndexUI[],
};

// Authorities Browse UI Configuration
export const authoritiesBrowseUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: '',
    subtitleId: '',
    placeholderId: '',
  },
  features: {
    hasSearchBy: true,
    hasMultilineInput: true,
    hasAdvancedSearch: false,
    isVisiblePaginationCount: false, // Browse doesn't show count
    isLoopedPagination: true, // Browse can loop
    isVisibleSubLabel: false,
  },
  searchableIndices: [] as SearchableIndexUI[],
};

// Authorities UI Registry
export const authoritiesUIRegistry = {
  default: authoritiesUIConfig,
  segments: {
    search: authoritiesUIConfig,
    browse: authoritiesBrowseUIConfig,
  },
};
