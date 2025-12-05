import type { SearchableIndexUI, SearchTypeUIConfig } from '../types';

export const hubsUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: 'ld.hubs',
    subtitleId: '',
    placeholderId: '',
    emptyStateId: 'ld.enterSearchCriteria',
  },
  features: {
    // Navigation
    hasSegments: false, // Hubs has no segments
    hasSourceToggle: true,

    // Input controls
    hasSearchBy: true,
    hasQueryInput: true,
    hasMultilineInput: false,
    hasSubmitButton: true,

    // Additional features
    hasAdvancedSearch: false,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: false,
    isVisibleEmptySearchPlaceholder: true,
  },
  searchableIndices: [
    {
      value: 'hubNameLeftAnchored',
      labelId: 'ld.search.hubNameLeftAnchored',
      placeholder: 'ld.placeholder.startsWith',
    },
    {
      value: 'hubNameKeyword',
      labelId: 'ld.search.hubNameKeyword',
    },
  ] as SearchableIndexUI[],
};
