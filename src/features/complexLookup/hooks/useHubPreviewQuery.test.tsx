import '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { getRecord } from '@/common/api/records.api';

import { useStatusStore } from '@/store';

import { useHubPreviewQuery } from './useHubPreviewQuery';

jest.mock('@/common/api/records.api', () => ({
  getRecord: jest.fn(),
}));

const mockGetProfiles = jest.fn();

jest.mock('@/common/hooks/useConfig.hook', () => ({
  useConfig: () => ({
    getProfiles: mockGetProfiles,
  }),
}));

describe('useHubPreviewQuery', () => {
  const addStatusMessagesItem = jest.fn();
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
    ]);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  describe('loadHubPreview', () => {
    test('fetches and transforms hub preview data', async () => {
      const recordData = { id: 'record_1', data: 'mock_data' } as unknown as RecordEntry;
      const generatedData = {
        base: new Map(),
        userValues: {},
        initKey: 'init_key_1',
      };

      (getRecord as jest.Mock).mockResolvedValue(recordData);
      mockGetProfiles.mockResolvedValue(generatedData);

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }), {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_1', 'Hub Title 1');

      await waitFor(
        () => {
          expect(result.current.previewData).not.toBeNull();
        },
        { timeout: 3000 },
      );

      expect(result.current.previewData?.id).toBe('hub_1');
      expect(result.current.previewData?.resource.initKey).toBe('init_key_1');
      expect(getRecord).toHaveBeenCalledWith({ recordId: 'hub_1', signal: expect.any(AbortSignal) });
      expect(mockGetProfiles).toHaveBeenCalledWith({
        record: recordData,
        recordId: 'hub_1',
        previewParams: { noStateUpdate: true },
        skipPreviewContentUpdate: true,
      });
      expect(result.current.previewMeta).toEqual({ id: 'hub_1', title: 'Hub Title 1' });
    });

    test('returns null when getProfiles returns null', async () => {
      const recordData = { id: 'record_2', data: 'mock_data' } as unknown as RecordEntry;

      (getRecord as jest.Mock).mockResolvedValue(recordData);
      mockGetProfiles.mockResolvedValue(null);

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }), {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_2', 'Hub Title 2');

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 3000 },
      );

      expect(result.current.isError).toBe(false);
      expect(result.current.previewData).toBeNull();
    });

    test('sets error state when fetch fails', async () => {
      const error = new Error('Network error');
      (getRecord as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }), {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_3', 'Hub Title 3');

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 3000 },
      );

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('resetPreview', () => {
    test('clears preview data and meta', async () => {
      const recordData = { id: 'record_4', data: 'mock_data' } as unknown as RecordEntry;
      const generatedData = {
        base: new Map(),
        userValues: {},
        initKey: 'init_key_1',
      };

      (getRecord as jest.Mock).mockResolvedValue(recordData);
      mockGetProfiles.mockResolvedValue(generatedData);

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }), {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_4', 'Hub Title 4');

      await waitFor(
        () => {
          expect(result.current.previewData).not.toBeNull();
        },
        { timeout: 3000 },
      );

      result.current.resetPreview();

      await waitFor(
        () => {
          expect(result.current.previewData).toBeNull();
          expect(result.current.previewMeta).toBeNull();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('enabled parameter', () => {
    test('does not fetch when isPreviewOpen is false', async () => {
      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.previewData).toBeNull();
      expect(result.current.isFetching).toBe(false);
    });

    test('fetches when isPreviewOpen is true', async () => {
      const recordData = { id: 'record_5', data: 'mock_data' } as unknown as RecordEntry;
      const generatedData = {
        base: new Map(),
        userValues: {},
        initKey: 'init_key_1',
      };

      (getRecord as jest.Mock).mockResolvedValue(recordData);
      mockGetProfiles.mockResolvedValue(generatedData);

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }), {
        wrapper: createWrapper(),
      });

      result.current.loadHubPreview('hub_5', 'Hub Title 5');

      await waitFor(
        () => {
          expect(result.current.previewData).not.toBeNull();
        },
        { timeout: 3000 },
      );

      expect(getRecord).toHaveBeenCalled();
    });
  });
});
