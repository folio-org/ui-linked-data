import { SearchIdentifiers } from '@common/constants/search.constants';
import { createContext } from 'react';

export const SearchContext = createContext<SearchContextValue>({
  endpointUrl: '',
  hasSearchParams: true,
  defaultSearchBy: SearchIdentifiers.LCCN,
  isSortedResults: true,
  isVisibleFilters: false,
  isVisibleFullDisplay: true,
  isVisibleAdvancedSearch: true,
  isVisibleSearchByControl: true,
  labelEmptySearch: '',
  classNameEmptyPlaceholder: '',
});
