export * from './buildSearchQuery';
export * from './buildHubSearchQuery';

import { buildSearchQuery } from './buildSearchQuery';
import { buildHubSearchQuery } from './buildHubSearchQuery';

/**
 * @deprecated Use request builder classes (ResourcesRequestBuilder, AuthoritiesSearchRequestBuilder, etc.) instead.
 * This legacy registry is kept for backward compatibility with existing hooks.
 */
export const SEARCH_QUERY_BUILDER: Record<
  string,
  ({ map, selector, searchBy, value }: BuildSearchQueryParams) => string | BuildSearchQueryResult | undefined
> = {
  default: buildSearchQuery,
  authorities: buildSearchQuery,
  hub: buildHubSearchQuery,
};
