import { setInitialGlobalState } from '@/test/__mocks__/store';

import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';

import { useSearchStore } from '@/store';

import type { SearchTypeConfig } from '../../core';
import { useSearchQuery } from './useSearchQuery';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

// Mock baseApi
const mockGetJson = jest.fn();
jest.mock('@/common/api/base.api', () => ({
  __esModule: true,
  default: {
    getJson: (...args: unknown[]) => mockGetJson(...args),
  },
}));

describe('useSearchQuery', () => {
  let queryClient: QueryClient;
  let mockRequestBuilder: { build: jest.Mock };
  let mockResponseTransformer: { transform: jest.Mock };
  let mockStrategies: { requestBuilder: { build: jest.Mock }; responseTransformer: { transform: jest.Mock } };
  let mockConfig: SearchTypeConfig;

  const mockSearchResults = {
    items: [{ id: '1', title: 'Test Result' }],
    pageMetadata: {
      totalElements: 1,
      totalPages: 1,
    },
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
        url: '/search/test',
        urlParams: { query: 'test' },
        sameOrigin: true,
      }),
    };

    mockResponseTransformer = {
      transform: jest.fn().mockReturnValue({
        content: mockSearchResults.items,
        totalRecords: mockSearchResults.totalRecords,
      }),
    };

    mockStrategies = {
      requestBuilder: mockRequestBuilder,
      responseTransformer: mockResponseTransformer,
    };

    mockConfig = {
      id: 'test',
      defaults: {
        searchBy: 'keyword',
        limit: 100,
      },
      strategies: mockStrategies,
    };

    mockGetJson.mockResolvedValue(mockSearchResults);

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
    mockGetJson.mockClear();
  });

  describe('URL flow', () => {
    it('executes query when URL has query param', async () => {
      const searchParams = new URLSearchParams({ query: 'test query', segment: 'search' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(mockGetJson).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockSearchResults);
    });

    it('does not execute query when URL has no query param', () => {
      const searchParams = new URLSearchParams({ segment: 'search' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      expect(mockGetJson).not.toHaveBeenCalled();
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
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should still execute - URL flow doesn't check navigationState
      expect(mockGetJson).toHaveBeenCalled();
    });

    it('does not execute when enabled is false', () => {
      const searchParams = new URLSearchParams({ query: 'test query' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
            enabled: false,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockGetJson).not.toHaveBeenCalled();
    });

    it('does not execute when fallbackCoreConfig is undefined', () => {
      const searchParams = new URLSearchParams({ query: 'test query' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: undefined,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      expect(mockGetJson).not.toHaveBeenCalled();
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
            fallbackCoreConfig: mockConfig,
            flow: 'value',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetJson).toHaveBeenCalled();
    });

    it('executes query even when segment does not match current segment', async () => {
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

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'value',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetJson).toHaveBeenCalled();
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
            fallbackCoreConfig: mockConfig,
            flow: 'value',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetJson).toHaveBeenCalled();
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
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(mockGetJson).toHaveBeenCalled();
      });

      expect(mockRequestBuilder.build).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'test',
          searchBy: 'title',
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
            fallbackCoreConfig: mockConfig,
            flow: 'url',
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
      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const configWithoutBuilder: SearchTypeConfig = {
        id: 'test',
        defaults: { limit: 100 },
        strategies: {},
      };

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: configWithoutBuilder,
            flow: 'url',
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
      mockResponseTransformer.transform.mockReturnValue({
        content: mockSearchResults.items,
        totalRecords: mockSearchResults.totalRecords,
      });

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockResponseTransformer.transform).toHaveBeenCalledWith(mockSearchResults, 100);
      expect(result.current.data).toEqual(mockSearchResults);
    });

    it('returns raw data when no transformer is provided', async () => {
      const configWithoutTransformer: SearchTypeConfig = {
        id: 'test',
        defaults: {
          searchBy: 'keyword',
          limit: 100,
        },
        strategies: {
          requestBuilder: mockRequestBuilder,
        },
      };

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: configWithoutTransformer,
            flow: 'url',
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
      mockGetJson.mockRejectedValue(new Error('Search request failed'));

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('Search request failed');
    });

    it('handles network errors', async () => {
      mockGetJson.mockRejectedValue(new Error('Network error'));

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
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
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetJson).toHaveBeenCalledTimes(1);

      await result.current.refetch();

      expect(mockGetJson).toHaveBeenCalledTimes(2);
    });
  });

  describe('Loading states', () => {
    it('returns correct loading states during query execution', async () => {
      let resolvePromise: (value: unknown) => void;
      mockGetJson.mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve;
        }),
      );

      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(
        () =>
          useSearchQuery({
            fallbackCoreConfig: mockConfig,
            flow: 'url',
          }),
        { wrapper: createWrapper() },
      );

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);

      // Resolve the promise
      resolvePromise!(mockSearchResults);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toEqual(mockSearchResults);
    });
  });
});
