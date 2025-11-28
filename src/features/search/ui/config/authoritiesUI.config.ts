import type { SearchTypeUIConfig } from '../types';

//Authorities Search UI Configuration
export const authoritiesUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: 'ld.marcAuthority',
    subtitleId: '',
    placeholderId: 'ld.enterSearchCriteria',
    emptyStateId: 'ld.noResultsFound',
  },
  features: {
    // Navigation
    hasSegments: true, // Authorities has segments (search/browse)
    hasSourceToggle: false, // Will be enabled per-segment

    // Input controls (shared)
    hasSearchBy: true,
    hasQueryInput: true,
    hasMultilineInput: true,
    hasSubmitButton: true,

    // Additional features
    hasAdvancedSearch: false,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: false,
  },
  searchableIndices: [
    { value: 'keyword', labelId: 'ld.keyword', placeholder: 'ld.searchByKeyword' },
    { value: 'personalName', labelId: 'ld.personalName', placeholder: 'ld.searchByPersonalName' },
    { value: 'corporateName', labelId: 'ld.corporateName', placeholder: 'ld.searchByCorporateName' },
  ],

  // Segment-specific overrides
  segments: {
    search: {
      features: {
        hasSourceToggle: false,
        hasAdvancedSearch: false,
      },
      searchableIndices: [
        {
          value: 'keyword',
          labelId: 'ld.keyword',
          placeholder: 'ld.searchByKeyword',
        },
        {
          value: 'personalName',
          labelId: 'ld.personalName',
          placeholder: 'ld.searchByPersonalName',
        },
        {
          value: 'corporateName',
          labelId: 'ld.corporateName',
          placeholder: 'ld.searchByCorporateName',
        },
        {
          value: 'uniformTitle',
          labelId: 'ld.uniformTitle',
          placeholder: 'ld.searchByUniformTitle',
        },
      ],
    },

    browse: {
      features: {
        // Disable source toggle in browse segment
        hasSourceToggle: false,
        hasAdvancedSearch: false,
        isLoopedPagination: true,
      },
      searchableIndices: [
        {
          value: 'name',
          labelId: 'ld.name',
          placeholder: 'ld.browseByName',
        },
        {
          value: 'title',
          labelId: 'ld.title',
          placeholder: 'ld.browseByTitle',
        },
      ],
    },
  },
};
