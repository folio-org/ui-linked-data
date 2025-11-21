// TODO: UILD-674 - revisit this module.
// It should be refactored in terms of using features/search/core features.
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';
import { RESPONSE_TRANSFORMERS } from '@/features/search/core';
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

// Type aliases for search parameter values
type LimitValue = string | number | undefined;
type OffsetValue = string | number | undefined;
type SearchParamUnion = string | number | object;

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

export const getSearchData = (url?: string, urlParams?: Record<string, string>) => {
  if (!url) return;

  return baseApi.getJson({ url, urlParams });
};

const normalizeLimitValue = (limit: LimitValue): string => {
  return typeof limit === 'string' || typeof limit === 'number' ? limit.toString() : SEARCH_RESULTS_LIMIT.toString();
};

const buildHubUrlParams = (queryParams: Record<string, string>, limit: LimitValue, offset?: OffsetValue) => {
  const urlParams: Record<string, string> = {
    ...queryParams,
    count: normalizeLimitValue(limit),
  };

  if (offset && (typeof offset === 'string' || typeof offset === 'number')) {
    urlParams.offset = offset.toString();
  }

  return urlParams;
};

const buildTraditionalUrlParams = (
  query: string,
  limit: LimitValue,
  offset?: OffsetValue,
  precedingRecordsCount?: number,
) => {
  const urlParams: Record<string, string> = {
    query: query,
    limit: normalizeLimitValue(limit),
  };

  if (offset && (typeof offset === 'string' || typeof offset === 'number')) {
    urlParams.offset = offset.toString();
  }

  if (precedingRecordsCount && typeof precedingRecordsCount === 'number') {
    urlParams.precedingRecordsCount = precedingRecordsCount.toString();
  }

  return urlParams;
};

const isParameterBasedQuery = (queryParams: SearchParamUnion | undefined): queryParams is object => {
  return queryParams !== undefined && typeof queryParams === 'object' && queryParams !== null;
};

const getResponseTransformer = (responseType: SearchParamUnion | undefined) => {
  const transformerKey = (
    typeof responseType === 'string' ? responseType : 'standard'
  ) as keyof typeof RESPONSE_TRANSFORMERS;

  return RESPONSE_TRANSFORMERS[transformerKey] || RESPONSE_TRANSFORMERS.standard;
};

const convertValue = (value: SearchParamUnion) => {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
};

export const getSearchResults = async (params: Record<string, SearchParamUnion>) => {
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

  // Build URL parameters based on query type
  const urlParams = isParameterBasedQuery(queryParams)
    ? buildHubUrlParams(queryParams as Record<string, string>, convertValue(limit), convertValue(offset))
    : buildTraditionalUrlParams(
        query as string,
        convertValue(limit),
        convertValue(offset),
        precedingRecordsCount as number,
      );

  const result = await baseApi.getJson({
    url: endpointUrl as string,
    urlParams,
    sameOrigin: typeof sameOrigin === 'boolean' ? sameOrigin : true,
  });
  const transformer = getResponseTransformer(responseType);

  return transformer({
    result: result as Record<string, unknown>,
    resultsContainer: resultsContainer as string,
    limit: typeof limit === 'string' ? +limit : +SEARCH_RESULTS_LIMIT,
  });
};
