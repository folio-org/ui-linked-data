type SearchQueryParams = import('@common/constants/routes.constants').SearchQueryParams;
type SearchIdentifiers = import('@common/constants/search.constants').SearchIdentifiers;

type SearchParamsState = {
  [key in SearchQueryParams]?: string | number | SearchIdentifiers;
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
  labelEmptySearch?: string;
  classNameEmptyPlaceholder?: string;
};
