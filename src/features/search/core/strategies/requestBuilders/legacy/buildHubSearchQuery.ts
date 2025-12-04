import { SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

/**
 * @deprecated Use HubsExternalRequestBuilder class instead.
 * This legacy function is kept for backward compatibility with existing hooks.
 */
export const buildHubSearchQuery = ({
  map,
  selector = SearchableIndexQuerySelector.Query,
  searchBy,
  value,
}: BuildSearchQueryParams): BuildSearchQueryResult => {
  const searchableIndex = map?.[searchBy];
  const config = searchableIndex?.[selector];

  if (typeof config === 'object' && config !== null) {
    const urlParams = {
      [config.paramName]: value,
      ...config.additionalParams,
    };

    return {
      queryType: 'parameters',
      query: value,
      urlParams,
    };
  }

  if (typeof config === 'string') {
    // Legacy string-based queries (fallback)
    const urlParams: Record<string, string> = { q: value };

    return {
      queryType: 'parameters',
      query: value,
      urlParams,
    };
  }

  // Default fallback
  return {
    queryType: 'parameters',
    query: value,
    urlParams: { q: value },
  };
};
