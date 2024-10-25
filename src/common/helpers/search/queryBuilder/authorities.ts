import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { SEARCH_QUERY_VALUE_PARAM } from '@common/constants/search.constants';

export const buildSearchQuery = ({
  map,
  selector = SearchableIndexQuerySelector.Query,
  searchBy,
  value,
}: BuildSearchQueryParams) => {
  const searchableIndex = map?.[searchBy];

  return searchableIndex?.[selector]?.replaceAll(SEARCH_QUERY_VALUE_PARAM, value);
};

export const buildBrowseQuery = () => {};
