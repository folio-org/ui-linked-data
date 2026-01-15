import type { SearchTypeUIConfig } from '../types';

export const hubsUIConfig: SearchTypeUIConfig = {
  limit: 50, // UI shows all 50 results per page
  ui: {
    titleId: 'ld.hubs',
    subtitleId: 'ld.recordsFound',
    placeholderId: '',
    emptyStateId: 'ld.enterSearchCriteria',
    noResultsId: 'ld.searchNoRdsMatch',
  },
  features: {
    // Navigation
    hasSegments: false, // Hubs has no segments
    hasSourceToggle: true,

    // Input controls
    hasSearchBy: false,
    hasQueryInput: true,
    hasMultilineInput: false,
    hasSubmitButton: true,

    // Additional features
    hasAdvancedSearch: false,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: true,
    isVisibleEmptySearchPlaceholder: true,
  },
};
