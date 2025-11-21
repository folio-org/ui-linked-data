export * from './authorities';
export * from './hubs';

import { buildSearchQuery } from './authorities';
import { buildHubSearchQuery } from './hubs';

export const SEARCH_QUERY_BUILDER: Record<
  string,
  ({ map, selector, searchBy, value }: BuildSearchQueryParams) => string | BuildSearchQueryResult | undefined
> = {
  default: buildSearchQuery,
  authorities: buildSearchQuery,
  hub: buildHubSearchQuery,
};
