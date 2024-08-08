import { SearchIdentifiers } from '@common/constants/search.constants';
import { createContext } from 'react';

export const SearchContext = createContext<SearchParams>({
  endpointUrl: '',
  searchFilter: '',
  hasSearchParams: true,
  defaultSearchBy: SearchIdentifiers.LCCN,
  isSortedResults: true,
  isVisibleFilters: false,
  isVisibleFullDisplay: true,
  isVisibleAdvancedSearch: true,
  isVisibleSearchByControl: true,
  searchByControlOptions: undefined,
  labelEmptySearch: '',
  classNameEmptyPlaceholder: '',
  filters: [],
  renderResultsList: () => null,
  renderSearchControlPane: () => null,
});
