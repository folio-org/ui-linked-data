import { SEARCH_QUERY_VALUE_PARAM } from '@common/constants/search.constants';

// TODO: define correct types
export const buildSearchQuery = (map: any, searchBy: string, value: string): string => {
  const searchableIndex = map[searchBy];

  return searchableIndex?.query?.replaceAll(SEARCH_QUERY_VALUE_PARAM, value);
};
