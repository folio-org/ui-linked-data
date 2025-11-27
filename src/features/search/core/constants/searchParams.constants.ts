/**
 * URL/Store search parameter keys
 * Used for consistency across URL params, store keys, and navigation state
 */
export const SearchParam = {
  QUERY: 'query',
  SEARCH_BY: 'searchBy',
  SEGMENT: 'segment',
  SOURCE: 'source',
  OFFSET: 'offset',
  LIMIT: 'limit',
} as const;

export type SearchParamKey = (typeof SearchParam)[keyof typeof SearchParam];
