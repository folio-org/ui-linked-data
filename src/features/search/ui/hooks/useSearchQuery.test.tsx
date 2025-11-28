import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import type { SearchTypeConfig, RequestBuilder, ResponseTransformer } from '../../core';
import { useSearchQuery } from './useSearchQuery';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

// Mock the utility module directly where selectStrategies is defined
const mockSelectStrategies = jest.fn();
jest.mock('../../core/utils/configSelectors.helper', () => ({
  selectStrategies: (...args: unknown[]) => mockSelectStrategies(...args),
}));

describe('useSearchQuery', () => {
  let queryClient: QueryClient;
  let mockRequestBuilder: RequestBuilder;
  let mockResponseTransformer: ResponseTransformer;
  let mockStrategies: { requestBuilder: RequestBuilder; responseTransformer: ResponseTransformer };
  let mockConfig: SearchTypeConfig;
  let mockFetch: jest.Mock;

  const mockSearchResults = {
    items: [{ id: '1', title: 'Test Result' }],
    totalRecords: 1,
  };

  const createWrapper = () => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    return Wrapper;
  };

  beforeEach(() => {
    mockRequestBuilder = {
      build: jest.fn().mockReturnValue({
        url: 'http://test.api/search?q=test',
        options: { method: 'GET' },
      }),
    };

    mockResponseTransformer = {
      transform: jest.fn().mockImplementation(data => data),
    };

    mockStrategies = {
      requestBuilder: mockRequestBuilder,
      responseTransformer: mockResponseTransformer,
    };

    mockConfig = {
      id: 'test',
      defaults: {
        segment: 'search',
        source: 'local',
        searchBy: 'keyword',
        limit: 100,
      },
      strategies: mockStrategies,
      sources: {},
    };

    mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    // Mock selectStrategies to return our mock strategies
    mockSelectStrategies.mockReturnValue(mockStrategies);

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {},
          committedValues: {
            query: '',
            searchBy: DEFAULT_SEARCH_BY,
            segment: undefined,
            source: undefined,
            offset: 0,
          },
        },
      },
    ]);
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('URL flow', () => {
    it('executes query when URL has query param', async () => {
      const searchParams = new URLSearchParams({ query: 'test query', segment: 'search' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            defaultSegment: 'search',
            hasSegments: true,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(mockFetch).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockSearchResults);
    });

    it('does not execute query when URL has no query param', () => {
      const searchParams = new URLSearchParams({ segment: 'search' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            defaultSegment: 'search',
            hasSegments: true,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not wait for navigationState sync in URL flow', async () => {
      // Simulate race condition: URL updated but navigationState not synced yet
      const searchParams = new URLSearchParams({ query: 'test', segment: 'browse' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { segment: 'search' },
            committedValues: {
              query: '',
              searchBy: DEFAULT_SEARCH_BY,
              segment: 'search',
              source: undefined,
              offset: 0,
            },
          },
        },
      ]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            defaultSegment: 'search',
            hasSegments: true,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should still execute - URL flow doesn't check navigationState
      expect(mockFetch).toHaveBeenCalled();
    });

    it('does not execute when enabled is false', () => {
      const searchParams = new URLSearchParams({ query: 'test query' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            enabled: false,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not execute when coreConfig is undefined', () => {
      const searchParams = new URLSearchParams({ query: 'test query' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            coreConfig: undefined,
            flow: 'url',
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Value flow', () => {
    it('executes query when store has query and segment matches', async () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { segment: 'search' },
            committedValues: {
              query: 'store query',
              searchBy: 'keyword',
              segment: 'search',
              source: undefined,
              offset: 0,
            },
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'value',
            defaultSegment: 'search',
            hasSegments: true,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('does not execute query when segment does not match current segment', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { segment: 'browse' },
            committedValues: {
              query: 'store query',
              searchBy: 'keyword',
              segment: 'search',
              source: undefined,
              offset: 0,
            },
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'value',
            defaultSegment: 'search',
            hasSegments: true,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('executes query when hasSegments is false regardless of segment', async () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { segment: 'different' },
            committedValues: {
              query: 'store query',
              searchBy: 'keyword',
              segment: 'search',
              source: undefined,
              offset: 0,
            },
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'value',
            hasSegments: false,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Query key', () => {
    it('creates query key from committed params', async () => {
      const searchParams = new URLSearchParams({
        query: 'test',
        segment: 'search',
        source: 'external',
        searchBy: 'title',
        offset: '10',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            hasSegments: true,
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockRequestBuilder.build).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'test',
          searchBy: 'title',
          source: 'external',
          offset: 10,
        }),
      );
    });
  });

  describe('Request building', () => {
    it('calls requestBuilder with correct parameters', async () => {
      const searchParams = new URLSearchParams({ query: 'search term', searchBy: 'author' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockRequestBuilder.build).toHaveBeenCalled();
      });

      expect(mockRequestBuilder.build).toHaveBeenCalledWith({
        query: 'search term',
        searchBy: 'author',
        source: undefined,
        limit: 100,
        offset: 0,
      });
    });

    it('throws error when no request builder for segment', async () => {
      mockSelectStrategies.mockReturnValue({});

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const configWithoutBuilder: SearchTypeConfig = {
        id: 'test',
        defaults: { limit: 100 },
        strategies: {},
        sources: {},
      };

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: configWithoutBuilder,
            flow: 'url',
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('No request builder');
    });
  });

  describe('Response handling', () => {
    it('transforms response when transformer is provided', async () => {
      const transformedResult = { items: [{ id: 'transformed' }], totalRecords: 1 };
      const transformer = {
        transform: jest.fn().mockReturnValue(transformedResult),
      };

      // Mock selectStrategies to return transformer
      mockSelectStrategies.mockReturnValue({
        requestBuilder: mockRequestBuilder,
        responseTransformer: transformer,
      });

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(transformer.transform).toHaveBeenCalledWith(mockSearchResults);
      expect(result.current.data).toEqual(transformedResult);
    });

    it('returns raw data when no transformer is provided', async () => {
      mockSelectStrategies.mockReturnValue({
        requestBuilder: mockRequestBuilder,
      });

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockSearchResults);
    });
  });

  describe('Error handling', () => {
    it('handles fetch errors', async () => {
      const errorFetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: errorFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('Search request failed');
    });

    it('handles network errors', async () => {
      const networkErrorFetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: networkErrorFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('Refetch', () => {
    it('provides refetch function that re-executes query', async () => {
      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: mockFetch,
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      await result.current.refetch();

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Loading states', () => {
    it('returns correct loading states during query execution', async () => {
      let resolvePromise: (value: unknown) => void;
      const slowFetch = jest.fn().mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve;
        }),
      );

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            coreConfig: mockConfig,
            flow: 'url',
            fetchFn: slowFetch,
          }),
        { wrapper: createWrapper() },
      );

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve(mockSearchResults),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toEqual(mockSearchResults);
    });
  });
});
