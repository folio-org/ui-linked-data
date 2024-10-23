import { buildSearchQuery } from './authorities';

export const SEARCH_QUERY_BUILDER: Record<
  string,
  ({ map, selector, searchBy, value }: BuildSearchQueryParams) => string | undefined
> = {
  default: buildSearchQuery,
  authorities: buildSearchQuery,
};
