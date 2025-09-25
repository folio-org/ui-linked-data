import { useCallback } from 'react';
import { getSearchResults } from '@common/api/search.api';
import { SearchIdentifiers, SearchSegment } from '@common/constants/search.constants';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useSearchState, useStatusState } from '@src/store';
import { useSearchContext } from './useSearchContext';

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
    return selectedSegment ? endpointUrlsBySegments?.[selectedSegment] : endpointUrl;
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
      mapForQuery = (searchableIndicesMap as SearchableIndicesMap)[selectedSegment as SearchSegmentValue];
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
      return queryResult as BuildSearchQueryResult;
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

        const isBrowseSearch = selectedNavigationSegment === SearchSegment.Browse;

        // Get response type from searchResultsContainer config (new approach)
        const responseType = (searchResults as { responseType?: string })?.responseType || 'standard';

        // Determine API call parameters based on query type
        const apiParams: {
          endpointUrl: string;
          searchFilter?: string;
          isSortedResults?: boolean;
          searchBy: SearchIdentifiers;
          offset?: string;
          limit?: string;
          precedingRecordsCount?: number;
          resultsContainer: unknown;
          responseType: string;
          query: string;
          queryParams?: Record<string, string>;
        } = {
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
        };

        if (queryResult.queryType === 'parameters' && queryResult.urlParams) {
          // Hub-style parameter query
          apiParams.queryParams = queryResult.urlParams;
        }

        const result = await fetchDataFromApi(apiParams);

        const { content, totalPages, totalRecords, prev, next } = result;

        if (!content?.length) return setMessage('ld.searchNoRdsMatch');

        setData(content);
        setPageMetadata({ totalPages, totalElements: totalRecords, prev, next });
        resetMessage();
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
