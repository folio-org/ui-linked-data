import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import baseApi from './base.api';

export type ItemSearchResponse = {
  searchQuery: string;
  content: WorkAsSearchResultDTO[];
};

export type GetByIdentifier = {
  endpointUrl: string;
  isSortedResults?: boolean;
  searchBy?: string;
  query: string;
  offset?: string;
  limit?: string;
};

export const getByIdentifier = async ({
  endpointUrl,
  isSortedResults = true,
  searchBy,
  query,
  offset = '0',
  limit = SEARCH_RESULTS_LIMIT.toString(),
}: GetByIdentifier) => {
  const sortQuery = isSortedResults ? ' sortby title' : '';
  const urlParams: Record<string, string> | undefined = {
    query: searchBy ? `(${searchBy} all "${query}")${sortQuery}` : `${query}${sortQuery}`,
    offset,
    limit,
  };

  return await baseApi.getJson({ url: endpointUrl, urlParams });
};
