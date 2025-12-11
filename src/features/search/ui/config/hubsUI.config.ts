import { SearchableIndex } from '@/common/constants/searchableIndex.constants';
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
