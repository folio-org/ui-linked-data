import { useCallback } from 'react';
import { useSetRecoilState, useRecoilState, SetterOrUpdater } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { SearchIdentifiers, SearchSegment } from '@common/constants/search.constants';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { StatusType } from '@common/constants/status.constants';
import { normalizeQuery } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import state from '@state';
import { useSearchContext } from './useSearchContext';

export const useFetchSearhData = () => {
  const {
    endpointUrl,
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
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setMessage = useSetRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const setPageMetadata = useSetRecoilState(state.search.pageMetadata);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);

  const validateAndNormalizeQuery = useCallback(
    (type: SearchIdentifiers, query: string) => {
      if (type === SearchIdentifiers.LCCN) {
        const normalized = normalizeLccn(query);

        !normalized && setMessage('ld.searchInvalidLccn');

        return normalized;
      }

      return normalizeQuery(query);
    },
    [setMessage],
  );

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

  const handleFetchError = (setStatusMessages: SetterOrUpdater<StatusEntry[]>) => {
    setStatusMessages(currentStatus => [
      ...currentStatus,
      UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'),
    ]);
  };

  const fetchData = useCallback(
    async ({
      query,
      searchBy,
      offset,
      selectedSegment,
      baseQuerySelector = SearchableIndexQuerySelector.Query,
    }: FetchDataParams) => {
      setMessage('');
      const selectedNavigationSegment = selectedSegment ?? navigationSegment?.value;

      data && setData(null);

      const updatedQuery = validateAndNormalizeQuery(searchBy, query);
      if (!updatedQuery) return;

      setIsLoading(true);

      try {
        const currentEndpointUrl = getEndpointUrl({
          selectedSegment: selectedNavigationSegment,
          endpointUrlsBySegments,
          endpointUrl,
        });
        const generatedQuery = generateQuery({
          searchBy,
          query: updatedQuery,
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

        if (!content.length) return setMessage('ld.searchNoRdsMatch');

        setData(content);
        setPageMetadata({ totalPages, totalElements: totalRecords, prev, next });
      } catch {
        handleFetchError(setStatusMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [data, endpointUrl, fetchSearchResults, navigationSegment?.value, searchFilter, isSortedResults],
  );

  return { fetchData };
};
