import { SearchableIndex } from '@/common/constants/searchableIndex.constants';
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
      labelId: 'ld.title',
      value: SearchableIndex.Title,
    },
    {
      labelId: 'ld.contributor',
      value: SearchableIndex.Contributor,
    },
    {
      labelId: 'ld.isbn',
      value: SearchableIndex.ISBN,
    },
    {
      labelId: 'ld.lccn',
      value: SearchableIndex.LCCN,
    },
  ],
};
