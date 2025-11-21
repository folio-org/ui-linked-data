import { FC, useMemo, useState, createContext, type ReactElement, useContext } from 'react';
import { SearchIdentifiers } from '@/common/constants/search.constants';

type SearchProviderProps = {
  value: SearchParams & { defaultNavigationSegment?: string };
  children: ReactElement<unknown>;
};

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

export const SearchProvider: FC<SearchProviderProps> = ({ value, children }) => {
  const [navigationSegment, setNavigationSegment] = useState(value.defaultNavigationSegment);

  const contextValue = useMemo(
    () => ({
      ...value,
      navigationSegment: { value: navigationSegment, set: setNavigationSegment },
    }),
    [navigationSegment, value],
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
  return useContext(SearchContext);
};
