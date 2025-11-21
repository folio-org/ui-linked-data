import type { SearchableIndexUI, SearchTypeUIConfig } from '../types';

export const hubsUIConfig: SearchTypeUIConfig = {
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
    isVisibleSubLabel: true,
  },
  searchableIndices: [] as SearchableIndexUI[],
};

export const hubsUIRegistry = {
  default: hubsUIConfig,
};
