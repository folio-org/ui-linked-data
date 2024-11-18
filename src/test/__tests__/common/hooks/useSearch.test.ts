import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';
import { useSearch } from '@common/hooks/useSearch';
import { useSearchContext } from '@common/hooks/useSearchContext';

const selectedNavigationSegment = 'defaultSegment';
const defaultSearchBy = 'defaultSearchBy';
const defaultQuery = 'defaultQuery';
const setCurrentPageNumber = jest.fn();
const onPrevPageClick = jest.fn();
const onNextPageClick = jest.fn();
const getCurrentPageNumber = jest.fn().mockReturnValue(0);
const fetchData = jest.fn();

jest.mock('react-router-dom');
jest.mock('recoil');
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
jest.mock('@state', () => ({
  default: {
    search: {
      index: '',
      query: '',
      limiters: {},
      message: '',
      data: null,
      pageMetadata: {},
      facetsBySegments: {
        defaultSegment: {
          query: 'defaultQuery',
          searchBy: 'defaultSearchBy',
          facets: {},
        },
      },
    },
    inputs: {
      userValues: {},
      previewContent: {},
    },
    loadingState: {
      isLoading: false,
    },
  },
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
  const clearFacetsBySegments = jest.fn();
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
    (useSearchContext as jest.Mock).mockReturnValue(mockUseSearchContext);
    (useSearchParams as jest.Mock).mockReturnValue([null, setSearchParams]);

    (useRecoilState as jest.Mock)
      .mockReturnValueOnce(['', setSearchBy])
      .mockReturnValueOnce(['', setQuery])
      .mockReturnValueOnce([{}, setFacets])
      .mockReturnValueOnce(['', setMessage])
      .mockReturnValueOnce([null, setData])
      .mockReturnValueOnce([{}, setPageMetadata])
      .mockReturnValueOnce([
        {
          newSegment: {
            query: 'newQuery',
            searchBy: 'newSearchBy',
            facets: {},
          },
        },
        setFacetsBySegments,
      ]);
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(setIsLoading).mockReturnValueOnce(setForceRefreshSearch);
    (useResetRecoilState as jest.Mock)
      .mockReturnValueOnce(resetPreviewContent)
      .mockReturnValueOnce(clearFacetsBySegments);
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

    expect(clearFacetsBySegments).toHaveBeenCalled();
  });
});
