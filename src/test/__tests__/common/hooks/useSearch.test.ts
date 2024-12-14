import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
import { useSearch } from '@common/hooks/useSearch';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { useInputsStore, useLoadingStateStore, useSearchStore } from '@src/store';

const selectedNavigationSegment = 'defaultSegment';
const defaultSearchBy = 'defaultSearchBy';
const defaultQuery = 'defaultQuery';
const setCurrentPageNumber = jest.fn();
const onPrevPageClick = jest.fn();
const onNextPageClick = jest.fn();
const getCurrentPageNumber = jest.fn().mockReturnValue(0);
const fetchData = jest.fn();

jest.mock('react-router-dom');
jest.mock('@common/hooks/useSearchContext');
jest.mock('@common/hooks/usePagination', () => ({
  usePagination: () => ({
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  }),
}));
jest.mock('@common/hooks/useFetchSearchData', () => ({
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
          searchBy: '',
          setSearchBy,
          query: '',
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
    (useSearchContext as jest.Mock).mockReturnValue(mockUseSearchContext);
    (useSearchParams as jest.Mock).mockReturnValue([null, setSearchParams]);
  });

  test('initializes with default values and set up effects', () => {
    renderHook(useSearch);

    expect(useSearchContext).toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
  });

  test('submits search and updates states correctly', () => {
    const updatedUseSearchContext = { ...mockUseSearchContext, hasSearchParams: false };
    (useSearchContext as jest.Mock).mockReturnValue(updatedUseSearchContext);

    const { result } = renderHook(useSearch);

    result.current.submitSearch();

    expect(fetchData).toHaveBeenCalled();
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
