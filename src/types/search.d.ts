type SearchQueryParams = import('@common/constants/routes.constants').SearchQueryParams;
type SearchIdentifiers = import('@common/constants/search.constants').SearchIdentifiers;

type SearchParamsState = {
  [key in SearchQueryParams]?: string | number | SearchIdentifiers;
};
