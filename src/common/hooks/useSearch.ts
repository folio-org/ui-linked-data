import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { SearchIdentifiers, SearchSegment } from '@common/constants/search.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { usePagination } from '@common/hooks/usePagination';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { useFetchSearchData } from '@common/hooks/useFetchSearchData';
import { useInputsState, useLoadingState } from '@src/store';
import state from '@state';

export const useSearch = () => {
  const {
    hasSearchParams,
    defaultSearchBy,
    defaultQuery,
    navigationSegment,
    hasCustomPagination,
    searchByControlOptions,
    getSearchSourceData,
  } = useSearchContext();
  const { setIsLoading } = useLoadingState();
  const { resetPreviewContent } = useInputsState();
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [facets, setFacets] = useRecoilState(state.search.limiters);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const [pageMetadata, setPageMetadata] = useRecoilState(state.search.pageMetadata);
  const setForceRefreshSearch = useSetRecoilState(state.search.forceRefresh);
  const [facetsBySegments, setFacetsBySegments] = useRecoilState(state.search.facetsBySegments);
  const clearFacetsBySegments = useResetRecoilState(state.search.facetsBySegments);

  const { fetchData } = useFetchSearchData();
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
      [selectedNavigationSegment]: {
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

  const handlePaginationClick = async ({
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
    baseQuerySelectorType: SearchableIndexQuerySelector;
    pageMetadataSelectorType: 'prev' | 'next';
  }) => {
    const isInitialPage = pageNumber === 0;
    const selectedQuery = (isInitialPage ? query : pageMetadata?.[pageMetadataSelectorType]) ?? query;
    const baseQuerySelector =
      isBrowseSearch && !isInitialPage ? baseQuerySelectorType : SearchableIndexQuerySelector.Query;

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

        await handlePaginationClick({
          pageNumber,
          query,
          pageMetadata,
          isBrowseSearch,
          searchBy,
          navigationSegment,
          baseQuerySelectorType: SearchableIndexQuerySelector.Prev,
          pageMetadataSelectorType: 'prev',
        });
      }
    : onPrevPageClickBase;

  const onNextPageClick = hasCustomPagination
    ? async () => {
        const pageNumber = onNextPageClickBase();

        await handlePaginationClick({
          pageNumber,
          query,
          pageMetadata,
          isBrowseSearch,
          searchBy,
          navigationSegment,
          baseQuerySelectorType: SearchableIndexQuerySelector.Next,
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
