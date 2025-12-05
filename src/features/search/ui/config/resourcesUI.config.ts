import type { SearchTypeUIConfig } from '../types';

export const resourcesUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: 'ld.resources',
    subtitleId: '',
    placeholderId: '',
    emptyStateId: 'ld.enterSearchCriteria',
  },
  features: {
    // Navigation
    hasSegments: false, // Resources has no segments
    hasSourceToggle: false, // No source selection

    // Input controls
    hasSearchBy: true,
    hasQueryInput: true,
    hasMultilineInput: false,
    hasSubmitButton: true,

    // Additional features
    hasAdvancedSearch: true,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: false,
    isVisibleEmptySearchPlaceholder: true,
  },
  searchableIndices: [
    {
      value: 'title',
      labelId: 'ld.title',
    },
    {
      value: 'contributor',
      labelId: 'ld.contributor',
    },
    {
      value: 'isbn',
      labelId: 'ld.isbn',
    },
    {
      value: 'lccn',
      labelId: 'ld.lccn',
    },
  ],
};
