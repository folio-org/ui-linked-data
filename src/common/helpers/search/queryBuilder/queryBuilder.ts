import { SEARCH_QUERY_VALUE_PARAM } from '@common/constants/search.constants';

export const buildSearchQuery = (map: SearchableIndexEntries, searchBy: SearchableIndexType, value: string) => {
  const searchableIndex = map?.[searchBy];

  return searchableIndex?.query?.replaceAll(SEARCH_QUERY_VALUE_PARAM, value);
};
