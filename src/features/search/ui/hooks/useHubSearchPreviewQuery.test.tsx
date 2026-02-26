import '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { logger } from '@/common/services/logger';

import { useStatusStore, useUIStore } from '@/store';

import { useHubSearchPreviewQuery } from './useHubSearchPreviewQuery';

const mockFetchRecord = jest.fn();

jest.mock('@/common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    fetchRecord: mockFetchRecord,
  }),
}));

jest.mock('@/common/services/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('useHubSearchPreviewQuery', () => {
  const addStatusMessagesItem = jest.fn();
  const resetFullDisplayComponentType = jest.fn();
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem,
        },
      },
      {
        store: useUIStore,
        state: {
          resetFullDisplayComponentType,
        },
      },
    ]);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  describe('loadHubPreview', () => {
    test('fetches hub record successfully', async () => {
      mockFetchRecord.mockResolvedValue(undefined);

      const { result } = renderHook(useHubSearchPreviewQuery, {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_1');

      await waitFor(
        () => {
          expect(mockFetchRecord).toHaveBeenCalledWith('hub_1', { singular: true }, expect.any(AbortSignal));
        },
        { timeout: 3000 },
      );

      expect(resetFullDisplayComponentType).toHaveBeenCalled();
    });

    test('resets full display component type before fetching', () => {
      mockFetchRecord.mockResolvedValue(undefined);

      const { result } = renderHook(useHubSearchPreviewQuery, {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_2');

      expect(resetFullDisplayComponentType).toHaveBeenCalled();
    });

    test('logs error when fetch fails', async () => {
      const error = new Error('Fetch error');
      mockFetchRecord.mockRejectedValue(error);

      const { result } = renderHook(useHubSearchPreviewQuery, {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_3');

      await waitFor(
        () => {
          expect(logger.error).toHaveBeenCalledWith('Error fetching hub record:', error);
        },
        { timeout: 3000 },
      );
    });

    test('handles consecutive calls', async () => {
      mockFetchRecord.mockResolvedValue(undefined);

      const { result } = renderHook(useHubSearchPreviewQuery, {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_4');

      await waitFor(
        () => {
          expect(mockFetchRecord).toHaveBeenCalledWith('hub_4', { singular: true }, expect.any(AbortSignal));
        },
        { timeout: 3000 },
      );

      result.current.loadHubPreview('hub_5');

      await waitFor(
        () => {
          expect(mockFetchRecord).toHaveBeenCalledWith('hub_5', { singular: true }, expect.any(AbortSignal));
        },
        { timeout: 3000 },
      );

      expect(mockFetchRecord).toHaveBeenCalledTimes(2);
    });
  });

  describe('isLoading state', () => {
    test('returns loading state correctly', async () => {
      let resolvePromise: () => void;
      const promise = new Promise<void>(resolve => {
        resolvePromise = resolve;
      });
      mockFetchRecord.mockReturnValue(promise);

      const { result } = renderHook(useHubSearchPreviewQuery, {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_6');

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      resolvePromise!();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
