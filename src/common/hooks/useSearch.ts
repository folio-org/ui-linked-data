import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { SearchIdentifiers, SearchSegment } from '@common/constants/search.constants';
import { StatusType } from '@common/constants/status.constants';
import { generateSearchParamsState, normalizeQuery } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { usePagination } from '@common/hooks/usePagination';
import state from '@state';
import { useSearchContext } from './useSearchContext';

export const useSearch = () => {
  const {
    endpointUrl,
    searchFilter,
    isSortedResults,
    hasSearchParams,
    defaultSearchBy,
    defaultQuery,
    navigationSegment,
    isVisibleSegments,
    hasCustomPagination,
    endpointUrlsBySegments,
    searchResultsLimit,
    fetchSearchResults,
    searchResultsContainer,
    searchByControlOptions,
    searchableIndicesMap,
    getSearchSourceData,
    buildSearchQuery,
    precedingRecordsCount,
  } = useSearchContext();
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [facets, setFacets] = useRecoilState(state.search.limiters);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const [pageMetadata, setPageMetadata] = useRecoilState(state.search.pageMetadata);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setForceRefreshSearch = useSetRecoilState(state.search.forceRefresh);
  const resetPreviewContent = useResetRecoilState(state.inputs.previewContent);
  const [facetsBySegments, setFacetsBySegments] = useRecoilState(state.search.facetsBySegments);
  const clearFacetsBySegments = useResetRecoilState(state.search.facetsBySegments);

  const {
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick: onPrevPageClickBase,
    onNextPageClick: onNextPageClickBase,
  } = usePagination(hasSearchParams, 0, hasCustomPagination);
  const currentPageNumber = getCurrentPageNumber();
  const setSearchParams = useSearchParams()?.[1];
  const selectedNavigationSegment = navigationSegment?.value;
  const isBrowseSearch = selectedNavigationSegment === SearchSegment.Browse;

  const updateFacetsBySegments = (query?: string, searchBy?: SearchIdentifiers, facets?: Limiters) => {
    if (!selectedNavigationSegment) return;

    setFacetsBySegments(prevValue => ({
      ...prevValue,
      [selectedNavigationSegment as string]: {
        query,
        searchBy,
        facets,
      },
    }));
  };

  const clearPagination = useCallback(() => {
    setPageMetadata(DEFAULT_PAGES_METADATA);
    setCurrentPageNumber(0);
  }, []);

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

  // TODO: refactor this function
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
        const currentEndpointUrl = selectedNavigationSegment
          ? endpointUrlsBySegments?.[selectedNavigationSegment]
          : endpointUrl;
        const selectedSearchableIndices =
          isVisibleSegments && selectedNavigationSegment
            ? searchableIndicesMap?.[selectedNavigationSegment as SearchSegmentValue]
            : searchableIndicesMap;
        const generatedQuery =
          fetchSearchResults && buildSearchQuery
            ? (buildSearchQuery({
                map: selectedSearchableIndices as SearchableIndexEntries,
                selector: baseQuerySelector,
                searchBy: searchBy as unknown as SearchableIndexType,
                value: updatedQuery,
              }) as string)
            : (updatedQuery as string);
        const isBrowseSearch = selectedNavigationSegment === SearchSegment.Browse;

        const result = fetchSearchResults
          ? await fetchSearchResults({
              endpointUrl: currentEndpointUrl ?? endpointUrl,
              searchFilter,
              isSortedResults,
              searchBy,
              query: generatedQuery,
              offset: offset?.toString(),
              limit: searchResultsLimit?.toString(),
              precedingRecordsCount: isBrowseSearch ? precedingRecordsCount : undefined,
              resultsContainer: searchResultsContainer?.[selectedNavigationSegment as SearchSegmentValue],
            })
          : await getByIdentifier({
              endpointUrl: currentEndpointUrl ?? endpointUrl,
              searchFilter,
              isSortedResults,
              searchBy,
              query: updatedQuery as string,
              offset: offset?.toString(),
              limit: searchResultsLimit?.toString(),
            });

        const { content, totalPages, totalRecords, prev, next } = result;

        // TODO: pass the message though the context
        if (!content.length) return setMessage('ld.searchNoRdsMatch');

        setData(content);
        setPageMetadata({ totalPages, totalElements: totalRecords, prev, next });
      } catch {
        setStatusMessages(currentStatus => [
          ...currentStatus,
          UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [data, endpointUrl, fetchSearchResults, navigationSegment?.value, searchFilter, isSortedResults],
  );

  const submitSearch = useCallback(() => {
    clearPagination();
    resetPreviewContent();
    updateFacetsBySegments(query, searchBy, facets);

    if (hasSearchParams) {
      setSearchParams(generateSearchParamsState(query, searchBy) as unknown as URLSearchParams);
    } else {
      fetchData({ query, searchBy });
    }

    setForceRefreshSearch(true);
  }, [fetchData, hasSearchParams, query, searchBy, selectedNavigationSegment, facets]);

  const clearValues = useCallback(() => {
    clearPagination();
    setData(null);
    setSearchBy(defaultSearchBy);
    setQuery('');
    setMessage('');
    resetPreviewContent();
    updateFacetsBySegments('', defaultSearchBy, {} as Limiters);
  }, [defaultSearchBy]);

  const onChangeSegment = async (value: SearchSegmentValue) => {
    const savedFacetsData = facetsBySegments[value];
    let updatedSearchBy;

    if (savedFacetsData.searchBy) {
      updatedSearchBy = savedFacetsData.searchBy;
    } else {
      const typedSearchByControlOptions = searchByControlOptions as ComplexLookupSearchBy;

      if (typedSearchByControlOptions[value]?.[0]) {
        updatedSearchBy = typedSearchByControlOptions[value][0].value;
      }
    }

    const typeSearchBy = updatedSearchBy as SearchIdentifiers;
    const selectedQuery = savedFacetsData.query || '';
    const selectedFacets = savedFacetsData.facets || {};

    setSearchBy(typeSearchBy);
    setQuery(selectedQuery);
    setFacets(selectedFacets);

    setIsLoading(true);
    clearPagination();
    await getSearchSourceData?.();
    await fetchData({
      query: selectedQuery,
      searchBy: typeSearchBy,
      selectedSegment: value,
    });
    setIsLoading(false);
  };

  const handlePageClick = async ({
    pageNumber,
    query,
    pageMetadata,
    isBrowseSearch,
    searchBy,
    navigationSegment,
    baseQuerySelectorType,
    pageMetadataSelectorType,
  }: {
    pageNumber: number;
    query: string;
    pageMetadata: PageMetadata;
    isBrowseSearch: boolean;
    searchBy: string;
    navigationSegment?: NavigationSegment;
    baseQuerySelectorType: 'Prev' | 'Next';
    pageMetadataSelectorType: 'prev' | 'next';
  }) => {
    const isInitialPage = pageNumber === 0;
    const selectedQuery = (isInitialPage ? query : pageMetadata?.[pageMetadataSelectorType]) || query;
    const baseQuerySelector =
      isBrowseSearch && !isInitialPage
        ? SearchableIndexQuerySelector[baseQuerySelectorType]
        : SearchableIndexQuerySelector.Query;

    await fetchData({
      query: selectedQuery,
      searchBy,
      offset: pageNumber,
      selectedSegment: navigationSegment?.value,
      baseQuerySelector,
    });
  };

  const onPrevPageClick = hasCustomPagination
    ? async () => {
        const pageNumber = onPrevPageClickBase();

        await handlePageClick({
          pageNumber,
          query,
          pageMetadata,
          isBrowseSearch,
          searchBy,
          navigationSegment,
          baseQuerySelectorType: 'Prev',
          pageMetadataSelectorType: 'prev',
        });
      }
    : onPrevPageClickBase;

  const onNextPageClick = hasCustomPagination
    ? async () => {
        const pageNumber = onNextPageClickBase();

        await handlePageClick({
          pageNumber,
          query,
          pageMetadata,
          isBrowseSearch,
          searchBy,
          navigationSegment,
          baseQuerySelectorType: 'Next',
          pageMetadataSelectorType: 'next',
        });
      }
    : onNextPageClickBase;

  useEffect(() => {
    setSearchBy(defaultSearchBy);

    if (defaultQuery) {
      setQuery(defaultQuery);
    }

    updateFacetsBySegments(defaultQuery ?? query, defaultSearchBy, facets);
  }, [setSearchBy, setQuery, defaultSearchBy, defaultQuery]);

  // Reset Segments selection on unmount
  useEffect(() => {
    return clearFacetsBySegments;
  }, [clearFacetsBySegments]);

  return {
    submitSearch,
    clearValues,
    onPrevPageClick,
    onNextPageClick,
    currentPageNumber,
    pageMetadata,
    message,
    data,
    fetchData,
    onChangeSegment,
  };
};
