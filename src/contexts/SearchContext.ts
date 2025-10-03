import { createContext } from 'react';
import { SearchIdentifiers } from '@common/constants/search.constants';

export const SearchContext = createContext<SearchParams>({
  endpointUrl: '',
  primarySegments: {},
  searchFilter: '',
  hasSearchParams: true,
  defaultSearchBy: SearchIdentifiers.LCCN,
  isSortedResults: true,
  isVisibleFilters: false,
  isVisibleFullDisplay: true,
  isVisibleAdvancedSearch: true,
  isVisibleSearchByControl: true,
  isVisibleSegments: false,
  common: {},
  searchByControlOptions: {},
  searchableIndicesMap: {} as SearchableIndicesMap,
  labelEmptySearch: '',
  classNameEmptyPlaceholder: '',
  filters: [],
  renderResultsList: () => null,
  renderSearchControlPane: () => null,
  fetchSearchResults: undefined,
  navigationSegment: {
    value: undefined,
    set: () => null,
  },
  hasMarcPreview: false,
  renderMarcPreview: () => null,
});
