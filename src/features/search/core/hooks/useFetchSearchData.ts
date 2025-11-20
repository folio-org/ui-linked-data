import { useCallback } from 'react';
import { getSearchResults } from '@/common/api/search.api';
import { SearchIdentifiers, SearchSegment } from '@/common/constants/search.constants';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { useLoadingState, useSearchState, useStatusState } from '@/store';
import { useSearchContext } from '@/features/search/ui';
import { SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

export const useFetchSearchData = () => {
  const {
    endpointUrl,
    sameOrigin,
    searchFilter,
    isSortedResults,
    navigationSegment,
    endpointUrlsBySegments,
    searchResultsLimit,
    fetchSearchResults,
    searchResults,
    searchableIndicesMap,
    buildSearchQuery,
    precedingRecordsCount,
  } = useSearchContext();
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { setMessage, resetMessage, data, setData, resetData, setPageMetadata } = useSearchState([
    'setMessage',
    'resetMessage',
    'data',
    'setData',
    'resetData',
    'setPageMetadata',
  ]);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const getEndpointUrl = ({
    selectedSegment,
    endpointUrlsBySegments,
    endpointUrl,
  }: {
    selectedSegment?: string;
    endpointUrlsBySegments?: EndpointUrlsBySegments;
    endpointUrl: string;
  }) => {
    return selectedSegment && endpointUrlsBySegments ? endpointUrlsBySegments[selectedSegment] : endpointUrl;
  };

  const generateQuery = ({
    searchBy,
    query,
    selectedSegment,
    searchableIndicesMap,
    baseQuerySelector,
  }: {
    searchBy: SearchableIndexType;
    query: string;
    selectedSegment?: string;
    searchableIndicesMap?: SearchableIndicesMap | HubSearchableIndicesMap;
    baseQuerySelector?: SearchableIndexQuerySelector;
  }) => {
    let mapForQuery: SearchableIndexEntries | HubSearchableIndicesMap | undefined;

    if (selectedSegment && searchableIndicesMap && 'search' in searchableIndicesMap) {
      // Traditional SearchableIndicesMap with segments
      mapForQuery = searchableIndicesMap[selectedSegment as SearchSegmentValue];
    } else if (searchableIndicesMap) {
      // HubSearchableIndicesMap (no segments)
      mapForQuery = searchableIndicesMap as HubSearchableIndicesMap;
    }

    const queryResult = buildSearchQuery?.({
      map: mapForQuery!,
      selector: baseQuerySelector,
      searchBy,
      value: query,
    });

    // Handle both string and BuildSearchQueryResult formats
    if (typeof queryResult === 'object' && queryResult && 'queryType' in queryResult) {
      return queryResult;
    }

    // Backward compatibility: string result
    return {
      queryType: 'string' as const,
      query: queryResult ?? query,
      urlParams: undefined,
    };
  };

  const fetchDataFromApi = async ({
    endpointUrl,
    searchFilter,
    isSortedResults,
    searchBy,
    query,
    queryParams,
    offset,
    limit,
    precedingRecordsCount,
    resultsContainer,
    responseType = 'standard',
  }: {
    endpointUrl: string;
    searchFilter?: string;
    isSortedResults?: boolean;
    searchBy: SearchIdentifiers;
    query: string;
    queryParams?: Record<string, string>;
    offset?: string;
    limit?: string;
    precedingRecordsCount?: number;
    resultsContainer: unknown;
    responseType?: string;
  }) => {
    return fetchSearchResults
      ? await fetchSearchResults({
          endpointUrl,
          sameOrigin,
          searchFilter,
          isSortedResults,
          searchBy,
          query,
          queryParams,
          offset,
          limit,
          precedingRecordsCount,
          resultsContainer,
          responseType,
        })
      : await getSearchResults({
          endpointUrl,
          query,
          ...(queryParams && { queryParams }),
          ...(offset && { offset }),
          ...(limit && { limit }),
          sameOrigin: (sameOrigin ?? true) ? 'true' : 'false',
          resultsContainer: resultsContainer ?? '',
          responseType,
        });
  };

  const buildApiParams = ({
    selectedNavigationSegment,
    currentEndpointUrl,
    queryResult,
    query,
    searchBy,
    offset,
  }: {
    selectedNavigationSegment?: string;
    currentEndpointUrl?: string;
    queryResult: BuildSearchQueryResult;
    query: string;
    searchBy: SearchIdentifiers;
    offset?: string | number;
  }) => {
    const isBrowseSearch = selectedNavigationSegment === SearchSegment.Browse;
    const responseType = (searchResults as { responseType?: string })?.responseType || 'standard';

    return {
      endpointUrl: currentEndpointUrl ?? '',
      searchFilter,
      isSortedResults,
      searchBy,
      offset: offset?.toString(),
      limit: searchResultsLimit?.toString(),
      precedingRecordsCount: isBrowseSearch ? precedingRecordsCount : undefined,
      resultsContainer: (searchResults?.containers as Record<string, unknown>)?.[
        selectedNavigationSegment as SearchSegmentValue
      ],
      responseType,
      query: queryResult.query || query,
      ...(queryResult.queryType === 'parameters' && queryResult.urlParams && { queryParams: queryResult.urlParams }),
    };
  };

  const handleApiResponse = (result: {
    content?: unknown[];
    totalPages?: number;
    totalRecords?: number;
    prev?: unknown;
    next?: unknown;
  }) => {
    const { content, totalPages, totalRecords, prev, next } = result;

    if (!content?.length) {
      return setMessage('ld.searchNoRdsMatch');
    }

    setData(content as WorkAsSearchResultDTO[]);
    setPageMetadata({
      totalPages: totalPages ?? 0,
      totalElements: totalRecords ?? 0,
      prev: prev as string | undefined,
      next: next as string | undefined,
    });
    resetMessage();
  };

  const fetchData = useCallback(
    async ({
      query,
      searchBy,
      offset,
      selectedSegment,
      baseQuerySelector = SearchableIndexQuerySelector.Query,
    }: FetchDataParams) => {
      const selectedNavigationSegment = selectedSegment ?? navigationSegment?.value;

      if (data) {
        resetData();
      }

      if (!query) return;

      setIsLoading(true);

      try {
        const currentEndpointUrl = getEndpointUrl({
          selectedSegment: selectedNavigationSegment,
          endpointUrlsBySegments,
          endpointUrl,
        });
        const queryResult = generateQuery({
          searchBy,
          query,
          selectedSegment: selectedNavigationSegment,
          searchableIndicesMap,
          baseQuerySelector,
        });
        const apiParams = buildApiParams({
          selectedNavigationSegment,
          currentEndpointUrl,
          queryResult,
          query,
          searchBy,
          offset,
        });

        const result = await fetchDataFromApi(apiParams);
        handleApiResponse(result);
      } catch {
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
      } finally {
        setIsLoading(false);
      }
    },
    [data, endpointUrl, fetchSearchResults, navigationSegment?.value, searchFilter, isSortedResults],
  );

  return { fetchData };
};
