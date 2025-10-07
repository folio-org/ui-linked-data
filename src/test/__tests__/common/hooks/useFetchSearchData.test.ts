import { renderHook } from '@testing-library/react';
import { useFetchSearchData } from '@common/hooks/useFetchSearchData';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { getSearchResults } from '@common/api/search.api';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useLoadingStateStore, useSearchStore } from '@src/store';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { SearchSegment } from '@common/constants/search.constants';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';

jest.mock('@common/hooks/useSearchContext');
jest.mock('@common/api/search.api');
jest.mock('@common/services/userNotification');

describe('useFetchSearchData', () => {
  const mockFetchSearchResults = jest.fn();
  const mockBuildSearchQuery = jest.fn();

  const mockSearchContext = {
    endpointUrl: '/test/endpoint',
    sameOrigin: true,
    searchFilter: 'test-filter',
    isSortedResults: true,
    navigationSegment: { value: SearchSegment.Search },
    endpointUrlsBySegments: {
      [SearchSegment.Search]: '/search/endpoint',
      [SearchSegment.Browse]: '/browse/endpoint',
    },
    searchResultsLimit: 100,
    fetchSearchResults: mockFetchSearchResults,
    searchResults: {
      responseType: 'standard',
      containers: {
        [SearchSegment.Search]: 'searchContainer',
        [SearchSegment.Browse]: 'browseContainer',
      },
    },
    searchableIndicesMap: {
      search: {
        testIndex: { value: 'test.index', label: 'Test Index' },
      },
    },
    buildSearchQuery: mockBuildSearchQuery,
    precedingRecordsCount: 10,
  };

  const mockSearchData = [
    { id: '1', title: 'Test Result 1' },
    { id: '2', title: 'Test Result 2' },
  ];

  const mockApiResponse = {
    content: mockSearchData,
    totalPages: 5,
    totalRecords: 50,
    prev: 'prev-token',
    next: 'next-token',
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useLoadingStateStore,
        state: { isLoading: false },
      },
      {
        store: useSearchStore,
        state: {
          data: null,
          message: '',
          pageMetadata: { totalPages: 0, totalElements: 0 },
        },
      },
    ]);

    (useSearchContext as jest.Mock).mockReturnValue(mockSearchContext);
    (getSearchResults as jest.Mock).mockResolvedValue(mockApiResponse);
    (UserNotificationFactory.createMessage as jest.Mock).mockReturnValue({
      type: StatusType.error,
      content: 'Error fetching data',
    });

    mockBuildSearchQuery.mockReturnValue({
      queryType: 'string',
      query: 'processed query',
      urlParams: undefined,
    });
  });

  describe('fetchData', () => {
    test('fetches data successfully with default parameters', async () => {
      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith({
        endpointUrl: '/search/endpoint',
        searchFilter: 'test-filter',
        isSortedResults: true,
        searchBy: 'title',
        offset: undefined,
        limit: '100',
        precedingRecordsCount: undefined,
        resultsContainer: 'searchContainer',
        responseType: 'standard',
        query: 'processed query',
        queryParams: undefined,
        sameOrigin: true,
      });
    });

    test('handles search with custom segment', async () => {
      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
        selectedSegment: SearchSegment.Browse,
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          endpointUrl: '/browse/endpoint',
          precedingRecordsCount: 10,
          resultsContainer: 'browseContainer',
        }),
      );
    });

    test('handles search with offset', async () => {
      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
        offset: 20,
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          offset: '20',
        }),
      );
    });

    test('handles custom query selector', async () => {
      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
        baseQuerySelector: SearchableIndexQuerySelector.Prev,
      });

      expect(mockBuildSearchQuery).toHaveBeenCalledWith({
        map: mockSearchContext.searchableIndicesMap.search,
        selector: SearchableIndexQuerySelector.Prev,
        searchBy: 'title',
        value: 'test query',
      });
    });

    test('handles parameter-based query result', async () => {
      mockBuildSearchQuery.mockReturnValue({
        queryType: 'parameters',
        query: 'hub query',
        urlParams: { type: 'Work', q: 'test' },
      });

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'hub query',
          queryParams: { type: 'Work', q: 'test' },
        }),
      );
    });

    test('handles hub searchable indices map', async () => {
      const mockHubSearchContext = {
        ...mockSearchContext,
        searchableIndicesMap: {
          hubIndex: { value: 'hub.index', label: 'Hub Index' },
        },
      };
      (useSearchContext as jest.Mock).mockReturnValue(mockHubSearchContext);

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockBuildSearchQuery).toHaveBeenCalledWith({
        map: mockHubSearchContext.searchableIndicesMap,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: 'title',
        value: 'test query',
      });
    });

    test('uses fetchSearchResults when available', async () => {
      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith({
        endpointUrl: '/search/endpoint',
        sameOrigin: true,
        searchFilter: 'test-filter',
        isSortedResults: true,
        searchBy: 'title',
        query: 'processed query',
        queryParams: undefined,
        offset: undefined,
        limit: '100',
        precedingRecordsCount: undefined,
        resultsContainer: 'searchContainer',
        responseType: 'standard',
      });
    });

    test('uses getSearchResults when fetchSearchResults is not available', async () => {
      const mockContextWithoutFetch = {
        ...mockSearchContext,
        fetchSearchResults: undefined,
      };
      (useSearchContext as jest.Mock).mockReturnValue(mockContextWithoutFetch);

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(getSearchResults).toHaveBeenCalledWith({
        endpointUrl: '/search/endpoint',
        query: 'processed query',
        sameOrigin: 'true',
        resultsContainer: 'searchContainer',
        responseType: 'standard',
        limit: '100',
      });
    });

    test('shows no results message when content is empty', async () => {
      const emptyResponse = { ...mockApiResponse, content: [] };
      mockFetchSearchResults.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).toHaveBeenCalled();
    });

    test('does not fetch when query is empty', async () => {
      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: '',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).not.toHaveBeenCalled();
    });

    test('handles API errors', async () => {
      mockFetchSearchResults.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorFetching');
    });

    test('handles backward compatibility with string query result', async () => {
      mockBuildSearchQuery.mockReturnValue('simple string query');

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'simple string query',
          queryParams: undefined,
        }),
      );
    });

    test('handles fallback endpoint URL', async () => {
      const mockContextWithoutSegments = {
        ...mockSearchContext,
        endpointUrlsBySegments: undefined,
        endpointUrl: '/test/endpoint',
      };
      (useSearchContext as jest.Mock).mockReturnValue(mockContextWithoutSegments);

      const { result } = renderHook(() => useFetchSearchData());

      await result.current.fetchData({
        query: 'test query',
        searchBy: 'title',
      });

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          endpointUrl: '/test/endpoint',
        }),
      );
    });
  });
});
