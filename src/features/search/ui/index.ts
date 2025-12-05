// Types
export * from './types';

// Components
export { AdvancedSearchModal } from './components/AdvancedSearchModal';
export { ItemSearch } from './components/ItemSearch';
export { LegacySearch, Search } from './components/Search';
export { LegacySearchControlPane, SearchControlPane } from './components/SearchControlPane';
export { SearchEmptyPlaceholder } from './components/SearchEmptyPlaceholder';
export { SearchFilters } from './components/SearchFilters';
export { SearchResultEntry } from './components/SearchResultEntry';
export { SearchResultList } from './components/SearchResultList';

// Providers
export { SearchContextLegacy, LegacySearchProvider, useSearchContextLegacy } from './providers';

// Hooks
export { useSearch, useLoadSearchResults, useSearchNavigationState, useSearchFilters } from './hooks';

// Utils
export { getActiveConfig, getSearchPlaceholder, getPlaceholderForProperty } from './utils';

// Config (examples)
export * from './config';
