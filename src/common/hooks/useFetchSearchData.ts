import { useCallback } from 'react';
import { getByIdentifier } from '@common/api/search.api';
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
    searchResultsContainer,
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
    searchableIndicesMap?: SearchableIndicesMap;
    baseQuerySelector?: SearchableIndexQuerySelector;
  }) => {
    const selectedSearchableIndices = selectedSegment
      ? searchableIndicesMap?.[selectedSegment as SearchSegmentValue]
      : searchableIndicesMap;

    return (
      buildSearchQuery?.({
        map: selectedSearchableIndices as SearchableIndexEntries,
        selector: baseQuerySelector,
        searchBy,
        value: query,
      }) ?? query
    );
  };

  const fetchDataFromApi = async ({
    endpointUrl,
    searchFilter,
    isSortedResults,
    searchBy,
    query,
    offset,
    limit,
    precedingRecordsCount,
    resultsContainer,
  }: {
    endpointUrl: string;
    searchFilter?: string;
    isSortedResults?: boolean;
    searchBy: SearchIdentifiers;
    query: string;
    offset?: string;
    limit?: string;
    precedingRecordsCount?: number;
    resultsContainer: any;
  }) => {
    return fetchSearchResults
      ? await fetchSearchResults({
          endpointUrl,
          sameOrigin,
          searchFilter,
          isSortedResults,
          searchBy,
          query,
          offset,
          limit,
          precedingRecordsCount,
          resultsContainer,
        })
      : await getByIdentifier({
          endpointUrl,
          searchFilter,
          isSortedResults,
          searchBy,
          query,
          offset,
          limit,
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

      data && resetData();

      if (!query) return;

      setIsLoading(true);

      try {
        const currentEndpointUrl = getEndpointUrl({
          selectedSegment: selectedNavigationSegment,
          endpointUrlsBySegments,
          endpointUrl,
        });
        const generatedQuery = generateQuery({
          searchBy,
          query,
          selectedSegment: selectedNavigationSegment,
          searchableIndicesMap,
          baseQuerySelector,
        });
        const isBrowseSearch = selectedNavigationSegment === SearchSegment.Browse;

        const result = await fetchDataFromApi({
          endpointUrl: currentEndpointUrl ?? '',
          searchFilter,
          isSortedResults,
          searchBy,
          query: generatedQuery,
          offset: offset?.toString(),
          limit: searchResultsLimit?.toString(),
          precedingRecordsCount: isBrowseSearch ? precedingRecordsCount : undefined,
          resultsContainer: searchResultsContainer?.[selectedNavigationSegment as SearchSegmentValue],
        });

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
