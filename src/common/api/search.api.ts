import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import baseApi from './base.api';

export type ItemSearchResponse = {
  searchQuery: string;
  content: WorkAsSearchResultDTO[];
};

export type GetByIdentifier = {
  endpointUrl: string;
  searchFilter?: string;
  isSortedResults?: boolean;
  searchBy?: string;
  query: string;
  offset?: string;
  limit?: string;
};

export const getByIdentifier = async ({
  endpointUrl,
  searchFilter,
  isSortedResults = true,
  searchBy,
  query,
  offset = '0',
  limit = SEARCH_RESULTS_LIMIT.toString(),
}: GetByIdentifier) => {
  const sortQuery = isSortedResults ? ' sortby title' : '';
  const filterQuery = searchFilter ? `and ${searchFilter}` : '';
  const urlParams: Record<string, string> | undefined = {
    query: searchBy ? `(${searchBy} all "${query}")${sortQuery}${filterQuery}` : `${query}${sortQuery}${filterQuery}`,
    offset,
    limit,
  };

  return await baseApi.getJson({ url: endpointUrl, urlParams });
};

export const getSearchSourceData = (url?: string, limit = '50') => {
  if (!url) return;

  return baseApi.getJson({ url, urlParams: { limit } });
};

export const getFacets = (url: string, urlParams?: Record<string, string>) => {
  // TODO: generate query params depending on the passed values instead of hardcoded
  const queryParams = urlParams || { facet: 'sourceFileId', query: 'id=*' };

  return baseApi.getJson({ url, urlParams: queryParams });
};
