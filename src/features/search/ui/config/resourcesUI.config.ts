import type { SearchableIndexUI, SearchTypeUIConfig } from '../types';

export const resourcesUIConfig: SearchTypeUIConfig = {
  ui: {
    titleId: '',
    subtitleId: '',
    placeholderId: '',
  },
  features: {
    hasSearchBy: true,
    hasMultilineInput: false,
    hasAdvancedSearch: true,
    isVisiblePaginationCount: true,
    isLoopedPagination: false,
    isVisibleSubLabel: true,
  },
  searchableIndices: [] as SearchableIndexUI[],
};

export const resourcesUIRegistry = {
  default: resourcesUIConfig,
};
