import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';
import { useInputsStore, useLoadingStateStore, useSearchStore } from '@/store';
import { SEARCH_RESULTS_LIMIT, SearchSegment } from '@/common/constants/search.constants';
import { SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';
import { SearchQueryParams } from '@/common/constants/routes.constants';
import { useSearchContextLegacy } from '../providers';
import { useSearch } from './useSearch';

const selectedNavigationSegment = 'defaultSegment';
const defaultSearchBy = 'defaultSearchBy';
const defaultQuery = 'defaultQuery';
const setCurrentPageNumber = jest.fn();
const onPrevPageClick = jest.fn();
const onNextPageClick = jest.fn();
const getCurrentPageNumber = jest.fn().mockReturnValue(0);
const fetchData = jest.fn();

jest.mock('react-router-dom');
jest.mock('@/features/search/ui/providers');
jest.mock('@/common/hooks/usePagination', () => ({
  usePagination: () => ({
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  }),
}));
jest.mock('@/features/search/core/hooks/useFetchSearchData', () => ({
  useFetchSearchData: () => ({
    fetchData,
  }),
}));

describe('useSearch hook', () => {
  const setIsLoading = jest.fn();
  const setSearchBy = jest.fn();
  const setQuery = jest.fn();
  const setFacets = jest.fn();
  const setMessage = jest.fn();
  const setData = jest.fn();
  const setPageMetadata = jest.fn();
  const setFacetsBySegments = jest.fn();
  const setForceRefreshSearch = jest.fn();
  const resetPreviewContent = jest.fn();
  const resetFacetsBySegments = jest.fn();
  const setSearchParams = jest.fn();

  const mockUseSearchContext = {
    hasSearchParams: true,
    defaultSearchBy,
    defaultQuery,
    navigationSegment: { value: selectedNavigationSegment },
    hasCustomPagination: true,
    searchByControlOptions: {},
    getSearchSourceData: jest.fn(),
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useLoadingStateStore,
        state: { isLoading: false, setIsLoading },
      },
      {
        store: useInputsStore,
        state: { previewContent: {}, resetPreviewContent },
      },
      {
        store: useSearchStore,
        state: {
          searchBy: 'title',
          setSearchBy,
          query: 'lord of /the "rings',
          setQuery,
          facets: {},
          setFacets,
          message: '',
          setMessage,
          data: null,
          setData,
          pageMetadata: {},
          setPageMetadata,
          setForceRefresh: setForceRefreshSearch,
          facetsBySegments: {
            defaultSegment: {
              query: 'defaultQuery',
              searchBy: 'defaultSearchBy',
              facets: {},
            },
          },
          setFacetsBySegments,
          resetFacetsBySegments,
        },
      },
    ]);
    (useSearchContextLegacy as jest.Mock).mockReturnValue(mockUseSearchContext);
    (useSearchParams as jest.Mock).mockReturnValue([null, setSearchParams]);
  });

  test('initializes with default values and set up effects', () => {
    renderHook(useSearch);

    expect(useSearchContextLegacy).toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
  });

  test('submits search and updates states correctly', () => {
    const updatedUseSearchContext = { ...mockUseSearchContext, hasSearchParams: false };
    (useSearchContextLegacy as jest.Mock).mockReturnValue(updatedUseSearchContext);

    const { result } = renderHook(useSearch);

    result.current.submitSearch();

    expect(fetchData).toHaveBeenCalledWith({
      searchBy: 'title',
      query: 'lord of \\/the \\"rings',
      offset: 0,
    });
    expect(setCurrentPageNumber).toHaveBeenCalledWith(0);
    expect(resetPreviewContent).toHaveBeenCalled();
    expect(setForceRefreshSearch).toHaveBeenCalledWith(true);
  });

  test('clears values and resets states', () => {
    const { result } = renderHook(useSearch);

    result.current.clearValues();

    expect(setCurrentPageNumber).toHaveBeenCalledWith(0);
    expect(setData).toHaveBeenCalledWith(null);
    expect(setSearchBy).toHaveBeenCalledWith(defaultSearchBy);
    expect(setQuery).toHaveBeenCalledWith('');
    expect(setMessage).toHaveBeenCalledWith('');
    expect(resetPreviewContent).toHaveBeenCalled();
  });

  describe('handlePageChange', () => {
    test('handles page change without custom pagination', async () => {
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set(SearchQueryParams.Query, 'test query');
      mockSearchParams.set(SearchQueryParams.SearchBy, 'test-search-by');

      (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams, setSearchParams]);
      (useSearchContextLegacy as jest.Mock).mockReturnValue({
        ...mockUseSearchContext,
        hasCustomPagination: false,
      });

      const { result } = renderHook(useSearch);

      await result.current.handlePageChange(2, SearchableIndexQuerySelector.Next, 'next');

      expect(fetchData).toHaveBeenCalledWith({
        query: 'test query',
        searchBy: 'test-search-by',
        offset: 2 * SEARCH_RESULTS_LIMIT,
      });
    });

    test('handles page change with empty search params', async () => {
      const emptySearchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([emptySearchParams, setSearchParams]);
      (useSearchContextLegacy as jest.Mock).mockReturnValue({
        ...mockUseSearchContext,
        hasCustomPagination: false,
      });

      const { result } = renderHook(useSearch);

      await result.current.handlePageChange(1, SearchableIndexQuerySelector.Next, 'next');

      expect(fetchData).toHaveBeenCalledWith({
        query: '',
        searchBy: null,
        offset: 1 * SEARCH_RESULTS_LIMIT,
      });
    });

    test('handles page change with browse search', async () => {
      (useSearchContextLegacy as jest.Mock).mockReturnValue({
        ...mockUseSearchContext,
        navigationSegment: { value: SearchSegment.Browse },
      });

      const { result } = renderHook(useSearch);

      await result.current.handlePageChange(1, SearchableIndexQuerySelector.Next, 'next');

      expect(fetchData).toHaveBeenCalledWith(
        expect.objectContaining({
          baseQuerySelector: SearchableIndexQuerySelector.Next,
        }),
      );
    });

    test('handles initial page (page 0) with browse search', async () => {
      (useSearchContextLegacy as jest.Mock).mockReturnValue({
        ...mockUseSearchContext,
        navigationSegment: { value: SearchSegment.Browse },
      });

      const { result } = renderHook(useSearch);

      await result.current.handlePageChange(0, SearchableIndexQuerySelector.Next, 'next');

      expect(fetchData).toHaveBeenCalledWith(
        expect.objectContaining({
          baseQuerySelector: SearchableIndexQuerySelector.Query,
        }),
      );
    });
  });

  test('handles onPrevPageClick with custom pagination', async () => {
    getCurrentPageNumber.mockReturnValue(1);
    onPrevPageClick.mockReturnValue(0);

    const { result } = renderHook(useSearch);

    await result.current.onPrevPageClick();

    expect(onPrevPageClick).toHaveBeenCalled();
    expect(fetchData).toHaveBeenCalled();
  });

  test('handles onNextPageClick with custom pagination', async () => {
    getCurrentPageNumber.mockReturnValue(0);
    onNextPageClick.mockReturnValue(1);

    const { result } = renderHook(useSearch);

    await result.current.onNextPageClick();

    expect(onNextPageClick).toHaveBeenCalled();
    expect(fetchData).toHaveBeenCalled();
  });

  test('handles onChangeSegment and update states', async () => {
    const newSegment = 'newSegment' as SearchSegmentValue;
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: {
          facetsBySegments: {
            [newSegment]: {
              query: 'newQuery',
              searchBy: 'newSearchBy',
              facets: {},
            },
          } as FacetsBySegments,
        },
      },
    ]);

    const { result } = renderHook(useSearch);

    await result.current.onChangeSegment(newSegment);

    expect(setSearchBy).toHaveBeenCalledWith('defaultSearchBy');
    expect(setQuery).toHaveBeenCalledWith('defaultQuery');
    expect(setFacets).toHaveBeenCalledWith({});
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setCurrentPageNumber).toHaveBeenCalledWith(0);
    expect(fetchData).toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });

  test('cleanups facetsBySegments on unmount', () => {
    const { unmount } = renderHook(useSearch);

    unmount();

    expect(resetFacetsBySegments).toHaveBeenCalled();
  });
});
