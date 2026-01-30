import { FC, type ReactElement, createContext, useContext, useMemo, useState } from 'react';

import { SearchIdentifiers } from '@/common/constants/search.constants';

type SearchProviderProps = {
  value: SearchParams & { defaultNavigationSegment?: string };
  children: ReactElement<unknown>;
};

export const SearchContextLegacy = createContext<SearchParams>({
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

export const LegacySearchProvider: FC<SearchProviderProps> = ({ value, children }) => {
  const [navigationSegment, setNavigationSegment] = useState(value.defaultNavigationSegment);

  const contextValue = useMemo(
    () => ({
      ...value,
      navigationSegment: { value: navigationSegment, set: setNavigationSegment },
    }),
    [navigationSegment, value],
  );

  return <SearchContextLegacy.Provider value={contextValue}>{children}</SearchContextLegacy.Provider>;
};

export const useSearchContextLegacy = () => {
  return useContext(SearchContextLegacy);
};
