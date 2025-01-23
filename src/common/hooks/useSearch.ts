import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers, SearchSegment } from '@common/constants/search.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { usePagination } from '@common/hooks/usePagination';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { useFetchSearchData } from '@common/hooks/useFetchSearchData';
import { useInputsState, useLoadingState, useSearchState, useUIState } from '@src/store';
import { FullDisplayType } from '@common/constants/uiElements.constants';

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
  const {
    searchBy,
    setSearchBy,
    query,
    setQuery,
    facets,
    setFacets,
    message,
    setMessage,
    data,
    setData,
    pageMetadata,
    setPageMetadata,
    setForceRefresh: setForceRefreshSearch,
    facetsBySegments,
    setFacetsBySegments,
    resetFacetsBySegments,
  } = useSearchState();
  const { fullDisplayComponentType } = useUIState();
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
    fullDisplayComponentType !== FullDisplayType.Comparison && resetPreviewContent();
    updateFacetsBySegments(query, searchBy, facets);

    if (hasSearchParams) {
      setSearchParams(generateSearchParamsState(query, searchBy) as unknown as URLSearchParams);
    }

    fetchData({ query, searchBy, offset: 0 });

    setForceRefreshSearch(true);
  }, [fetchData, hasSearchParams, query, searchBy, selectedNavigationSegment, facets]);

  const clearValues = useCallback(() => {
    clearPagination();
    setData(null);
    setSearchBy(defaultSearchBy);
    setQuery('');
    setMessage('');
    fullDisplayComponentType !== FullDisplayType.Comparison && resetPreviewContent();
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

  const onPrevPageClick = async () => {
    const pageNumber = onPrevPageClickBase();

    if (hasCustomPagination) {
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
    } else {
      await fetchData({
        query,
        searchBy,
        offset: pageNumber * SEARCH_RESULTS_LIMIT,
      });
    }
  };

  const onNextPageClick = async () => {
    const pageNumber = onNextPageClickBase();

    if (hasCustomPagination) {
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
    } else {
      await fetchData({
        query,
        searchBy,
        offset: pageNumber * SEARCH_RESULTS_LIMIT,
      });
    }
  };

  useEffect(() => {
    setSearchBy(defaultSearchBy);

    if (defaultQuery) {
      setQuery(defaultQuery);
    }

    updateFacetsBySegments(defaultQuery ?? query, defaultSearchBy, facets);
  }, [setSearchBy, setQuery, defaultSearchBy, defaultQuery]);

  // Reset Segments selection on unmount
  useEffect(() => {
    return resetFacetsBySegments;
  }, [resetFacetsBySegments]);

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
