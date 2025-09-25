import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import { RESPONSE_TRANSFORMERS } from '@common/helpers/search/responseTransformers';
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
  const filterQuery = searchFilter ? ` and ${searchFilter}` : '';
  const urlParams: Record<string, string> | undefined = {
    query: searchBy ? `(${searchBy} all "${query}")${sortQuery}${filterQuery}` : `${query}${sortQuery}${filterQuery}`,
    offset,
    limit,
  };

  return await baseApi.getJson({ url: endpointUrl, urlParams });
};

// TODO: generate search params
export const getSearchData = (url?: string, urlParams?: Record<string, string>) => {
  if (!url) return;

  return baseApi.getJson({ url, urlParams });
};

export const getSearchResults = async (params: Record<string, string | number | object>) => {
  const {
    endpointUrl,
    sameOrigin,
    query,
    queryParams,
    offset,
    limit = SEARCH_RESULTS_LIMIT.toString(),
    resultsContainer,
    precedingRecordsCount,
    responseType = 'standard',
  } = params;

  let urlParams: Record<string, string>;

  if (queryParams && typeof queryParams === 'object' && queryParams !== null) {
    // Hub-style parameter queries
    urlParams = {
      ...(queryParams as Record<string, string>),
      count:
        typeof limit === 'string' || typeof limit === 'number' ? limit.toString() : SEARCH_RESULTS_LIMIT.toString(),
    };

    if (offset && typeof offset === 'string') {
      urlParams.offset = offset;
    }
  } else {
    // Traditional string-based queries (authorities)
    urlParams = {
      query: query as string,
      limit:
        typeof limit === 'string' || typeof limit === 'number' ? limit.toString() : SEARCH_RESULTS_LIMIT.toString(),
    };

    if (offset && typeof offset === 'string') {
      urlParams.offset = offset;
    }

    if (precedingRecordsCount && typeof precedingRecordsCount === 'number') {
      urlParams.precedingRecordsCount = precedingRecordsCount.toString();
    }
  }

  const result = await baseApi.getJson({
    url: endpointUrl as string,
    urlParams,
    sameOrigin: typeof sameOrigin === 'boolean' ? sameOrigin : true,
  });

  // Transform response based on API type
  const transformerKey = (
    typeof responseType === 'string' ? responseType : 'standard'
  ) as keyof typeof RESPONSE_TRANSFORMERS;
  const transformer = RESPONSE_TRANSFORMERS[transformerKey] || RESPONSE_TRANSFORMERS.standard;

  return transformer({
    result: result as Record<string, unknown>,
    resultsContainer: resultsContainer as string,
    limit: typeof limit === 'string' ? +limit : +SEARCH_RESULTS_LIMIT,
  });
};
