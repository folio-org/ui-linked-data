import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusStore } from '@/store';

import { getHubByUri } from '../api/hubImport.api';
import { useHubQuery } from './useHubQuery';

jest.mock('@/features/hubImport/api/hubImport.api', () => ({
  ...jest.requireActual('@/features/hubImport/api/hubImport.api'),
  getHubByUri: jest.fn(),
}));
jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

const mockGetRecordAndInitializeParsing = jest.fn();
jest.mock('@/common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    getRecordAndInitializeParsing: mockGetRecordAndInitializeParsing,
  }),
}));

describe('useHubQuery', () => {
  const addStatusMessagesItem = jest.fn();
  let queryClient: QueryClient;

  const mockRecord = {
    id: 'test_hub_id',
    resource: { id: 'test_hub_id', label: 'Test Hub' },
  } as unknown as RecordEntry;

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

    mockGetRecordAndInitializeParsing.mockResolvedValue(undefined);
    (getHubByUri as jest.Mock).mockResolvedValue(mockRecord);
  });

  describe('useHubQuery', () => {
    it('Fetches hub data when hubUri is provided', async () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_123';

      const { result } = renderHook(() => useHubQuery({ hubUri }), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(getHubByUri).toHaveBeenCalledWith({
        hubUri: 'https://id.loc.gov/resources/hubs/hub_123.json',
        signal: expect.any(AbortSignal),
      });
      expect(mockGetRecordAndInitializeParsing).toHaveBeenCalledWith({
        cachedRecord: mockRecord,
        errorMessage: 'ld.errorFetchingHubForPreview',
      });
      expect(result.current.data).toBe(mockRecord);
      expect(result.current.isError).toBe(false);
    });

    it('Normalizes http to https in hub URI', async () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_456';

      const { result } = renderHook(() => useHubQuery({ hubUri }), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(getHubByUri).toHaveBeenCalledWith({
        hubUri: 'https://id.loc.gov/resources/hubs/hub_456.json',
        signal: expect.any(AbortSignal),
      });
      expect(result.current.data).toBe(mockRecord);
    });

    it('Does not fetch when hubUri is undefined', () => {
      const { result } = renderHook(() => useHubQuery({ hubUri: undefined }), { wrapper: createWrapper() });

      expect(getHubByUri).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });

    it('Does not fetch when enabled is false', () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_789';

      const { result } = renderHook(() => useHubQuery({ hubUri, enabled: false }), { wrapper: createWrapper() });

      expect(getHubByUri).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });

    it('Handles fetch errors', async () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_error';
      const error = new Error('Fetch failed');
      (getHubByUri as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useHubQuery({ hubUri }), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(addStatusMessagesItem).toHaveBeenCalledWith(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetchingHubForPreview'),
      );
      expect(result.current.error).toBe(error);
    });

    it('Does not show error for aborted requests', async () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_abort';
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      (getHubByUri as jest.Mock).mockRejectedValue(abortError);

      const { result } = renderHook(() => useHubQuery({ hubUri }), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(addStatusMessagesItem).not.toHaveBeenCalled();
    });

    it('Refetches data when refetch is called', async () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_refetch';

      const { result } = renderHook(() => useHubQuery({ hubUri }), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const firstCallCount = (getHubByUri as jest.Mock).mock.calls.length;

      await result.current.refetch();

      await waitFor(() => expect((getHubByUri as jest.Mock).mock.calls.length).toBe(firstCallCount + 1));
    });

    it('Does not refetch when hubUri is undefined', async () => {
      const { result } = renderHook(() => useHubQuery({ hubUri: undefined }), { wrapper: createWrapper() });

      const callCountBefore = (getHubByUri as jest.Mock).mock.calls.length;

      await result.current.refetch();

      expect((getHubByUri as jest.Mock).mock.calls.length).toBe(callCountBefore);
    });

    it('Returns correct loading and fetching states', async () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_loading';
      (getHubByUri as jest.Mock).mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve(mockRecord);
            }, 100),
          ),
      );

      const { result } = renderHook(() => useHubQuery({ hubUri }), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBe(mockRecord);
    });
  });
});
