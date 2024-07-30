type SearchQueryParams = import('@common/constants/routes.constants').SearchQueryParams;
type SearchIdentifiers = import('@common/constants/search.constants').SearchIdentifiers;

type SearchParamsState = {
  [key in SearchQueryParams]?: string | number | SearchIdentifiers;
};

type SearchParams = {
  endpointUrl: string;
  filters: SearchFilters;
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
  controlPaneComponent: ReactElement;
  resultsListComponent: ReactElement;
  isSortedResults?: boolean;
  isVisibleFilters?: boolean;
  isVisibleFullDisplay?: boolean;
  isVisibleAdvancedSearch?: boolean;
  isVisibleSearchByControl?: boolean;
  labelEmptySearch?: string;
  classNameEmptyPlaceholder?: string;
};

type SearchContextValue = Omit<SearchParams, 'filters' | 'controlPaneComponent' | 'resultsListComponent'>;
