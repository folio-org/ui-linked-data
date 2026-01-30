import { SearchableIndex } from '@/common/constants/searchableIndex.constants';

import type { SearchTypeUIConfig, SearchableIndexUI } from '../types';

export const hubsLookupUIConfig: SearchTypeUIConfig = {
  limit: 100, // UI shows all 100 results per page
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
    hasSearchBy: true,
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
  searchableIndices: [
    {
      labelId: 'ld.search.hubNameLeftAnchored',
      value: SearchableIndex.HubNameLeftAnchored,
      placeholder: 'ld.placeholder.startsWith',
    },
    {
      labelId: 'ld.search.hubNameKeyword',
      value: SearchableIndex.HubNameKeyword,
    },
  ] as SearchableIndexUI[],
};
