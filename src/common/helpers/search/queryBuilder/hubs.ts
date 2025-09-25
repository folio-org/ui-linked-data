import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';

export const buildHubSearchQuery = ({
  map,
  selector = SearchableIndexQuerySelector.Query,
  searchBy,
  value,
}: BuildSearchQueryParams): BuildSearchQueryResult => {
  const searchableIndex = map?.[searchBy];
  const config = searchableIndex?.[selector];

  if (typeof config === 'object' && config !== null) {
    const paramConfig = config as QueryParameterConfig;
    const urlParams = {
      [paramConfig.paramName]: value,
      ...paramConfig.additionalParams,
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
