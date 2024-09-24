type SearchQueryParams = import('@common/constants/routes.constants').SearchQueryParams;
type SearchIdentifiers = import('@common/constants/search.constants').SearchIdentifiers;
type SearchSegmentValue = import('@common/constants/search.constants').SearchSegment;

type SearchParamsState = {
  [key in SearchQueryParams]?: string | number | SearchIdentifiers;
};

type NavigationSegment = {
  value?: string;
  set: Dispatch<SetStateAction<boolean>> | VoidFunction;
};

type SearchParams = {
  endpointUrl: string;
  searchFilter?: string;
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
  filters: SearchFilters;
  renderSearchControlPane: () => JSX.Element | null;
  renderResultsList: () => JSX.Element | null;
  isSortedResults?: boolean;
  isVisibleFilters?: boolean;
  isVisibleFullDisplay?: boolean;
  isVisibleAdvancedSearch?: boolean;
  isVisibleSearchByControl?: boolean;
  isVisibleSegments?: boolean;
  hasMiltilineSearchInput?: boolean;
  searchByControlOptions?: (string | SelectValue)[] | ComplexLookupSearchBy;
  labelEmptySearch?: string;
  classNameEmptyPlaceholder?: string;
  navigationSegment?: NavigationSegment;
  getSearchSourceData?: (url?: string) => Promise<void>;
  getSearchFacetsData?: (facet?: string) => Promise<void>;
};

type FacetsBySegments = {
  [key in SearchSegmentValue]: {
    query?: string;
    searchBy?: string;
    facets: Limiters;
  };
};
