import { SEARCH_QUERY_VALUE_PARAM } from '@/common/constants/search.constants';
import { SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

/**
 * @deprecated Use AuthoritiesSearchRequestBuilder or AuthoritiesBrowseRequestBuilder class instead.
 * This legacy function is kept for backward compatibility with existing hooks.
 */
export const buildSearchQuery = ({
  map,
  selector = SearchableIndexQuerySelector.Query,
  searchBy,
  value,
}: BuildSearchQueryParams) => {
  const searchableIndex = map?.[searchBy];
  const config = searchableIndex?.[selector];

  // Handle string-based queries (traditional CQL)
  if (typeof config === 'string') {
    return config.replaceAll(SEARCH_QUERY_VALUE_PARAM, value);
  }

  // Handle object-based queries (parameter configs) - not applicable for "authorities"
  // but needed for type compatibility
  return undefined;
};
