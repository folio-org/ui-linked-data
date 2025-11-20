import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGES_METADATA } from '@/common/constants/api.constants';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers, SearchSegment } from '@/common/constants/search.constants';
import { SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';
import { generateSearchParamsState, normalizeQuery, useFetchSearchData } from '@/features/search/core';
import { usePagination } from '@/common/hooks/usePagination';
import { useInputsState, useLoadingState, useSearchState, useUIState } from '@/store';
import { FullDisplayType } from '@/common/constants/uiElements.constants';
import { SearchQueryParams } from '@/common/constants/routes.constants';
import { useSearchContext } from '../providers';

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
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { resetPreviewContent } = useInputsState(['resetPreviewContent']);
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
  } = useSearchState([
    'searchBy',
    'setSearchBy',
    'query',
    'setQuery',
    'facets',
    'setFacets',
    'message',
    'setMessage',
    'data',
    'setData',
    'pageMetadata',
    'setPageMetadata',
    'setForceRefresh',
    'facetsBySegments',
    'setFacetsBySegments',
    'resetFacetsBySegments',
  ]);
  const { fullDisplayComponentType } = useUIState(['fullDisplayComponentType']);
  const { fetchData } = useFetchSearchData();
  const {
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick: onPrevPageClickBase,
    onNextPageClick: onNextPageClickBase,
  } = usePagination(hasSearchParams, 0, hasCustomPagination);
  const currentPageNumber = getCurrentPageNumber();
  const [searchParams, setSearchParams] = useSearchParams();
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
    const normalizedQuery = normalizeQuery(query) ?? '';
    clearPagination();
    fullDisplayComponentType !== FullDisplayType.Comparison && resetPreviewContent();
    updateFacetsBySegments(normalizedQuery, searchBy, facets);

    if (hasSearchParams) {
      setSearchParams(generateSearchParamsState(normalizedQuery, searchBy) as unknown as URLSearchParams);
    }

    fetchData({ query: normalizedQuery, searchBy, offset: 0 });

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
    const selectedQuery = savedFacetsData.query ?? '';
    const selectedFacets = savedFacetsData.facets ?? {};

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

  const handlePageChange = async (
    pageNumber: number,
    querySelector: SearchableIndexQuerySelector,
    metadataSelector: 'prev' | 'next',
  ) => {
    if (hasCustomPagination) {
      await handlePaginationClick({
        pageNumber,
        query,
        pageMetadata,
        isBrowseSearch,
        searchBy,
        navigationSegment,
        baseQuerySelectorType: querySelector,
        pageMetadataSelectorType: metadataSelector,
      });
    } else {
      const queryValue = searchParams.get(SearchQueryParams.Query) ?? '';

      await fetchData({
        query: queryValue,
        searchBy: searchParams.get(SearchQueryParams.SearchBy),
        offset: pageNumber * SEARCH_RESULTS_LIMIT,
      });
    }
  };

  const onPrevPageClick = async () => {
    const pageNumber = onPrevPageClickBase();

    await handlePageChange(pageNumber, SearchableIndexQuerySelector.Prev, 'prev');
  };

  const onNextPageClick = async () => {
    const pageNumber = onNextPageClickBase();

    await handlePageChange(pageNumber, SearchableIndexQuerySelector.Next, 'next');
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
    handlePageChange,
  };
};
