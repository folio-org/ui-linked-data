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
      placeholder: 'ld.searchByTitle',
    },
    {
      value: 'contributor',
      labelId: 'ld.contributor',
      placeholder: 'ld.searchByContributor',
    },
    {
      value: 'isbn',
      labelId: 'ld.isbn',
      placeholder: 'ld.searchByISBN',
    },
    {
      value: 'lccn',
      labelId: 'ld.lccn',
      placeholder: 'ld.searchByLCCN',
    },
  ],
};
