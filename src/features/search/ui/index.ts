// Types
export * from './types';

// Components
export { AdvancedSearchModal } from './components/AdvancedSearchModal';
export { ItemSearch } from './components/ItemSearch';
export { LegacySearch } from './components/Search';
export { SearchControlPane } from './components/SearchControlPane';
export { SearchControls, SearchSegments } from './components/SearchControls';
export { SearchFilters } from './components/SearchFilters';
export { SearchResultEntry } from './components/SearchResultEntry';
export { SearchResultList } from './components/SearchResultList';

// Providers
export { SearchContextLegacy, LegacySearchProvider, useSearchContextLegacy } from './providers';

// Hooks
export { useSearch, useLoadSearchResults, useSearchNavigationState, useSearchFilters } from './hooks';

// Config (examples)
export * from './config';
