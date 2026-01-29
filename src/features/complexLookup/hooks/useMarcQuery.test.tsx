import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import baseApi from '@/common/api/base.api';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusStore } from '@/store';

import { useMarcQuery } from './useMarcQuery';

jest.mock('@/common/api/base.api');
jest.mock('@/common/services/userNotification');

describe('useMarcQuery', () => {
  const mockAddStatusMessagesItem = jest.fn();
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
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
        state: { addStatusMessagesItem: mockAddStatusMessagesItem },
      },
    ]);

    (baseApi.generateUrl as jest.Mock).mockReturnValue('/api/marc/test-id');
    (baseApi.getJson as jest.Mock).mockResolvedValue({
      id: 'marc-123',
      matchedId: 'srs-456',
    } as MarcDTO);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('fetches MARC data when recordId is provided', async () => {
    const { result } = renderHook(
      () =>
        useMarcQuery({
          recordId: 'test-id',
          endpointUrl: '/api/marc/:recordId',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(baseApi.generateUrl).toHaveBeenCalledWith('/api/marc/:recordId', {
      name: ':recordId',
      value: 'test-id',
    });
  });

  it('does not fetch when recordId is not provided', async () => {
    const { result } = renderHook(
      () =>
        useMarcQuery({
          recordId: undefined,
          endpointUrl: '/api/marc/:recordId',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(baseApi.getJson).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', async () => {
    const { result } = renderHook(
      () =>
        useMarcQuery({
          recordId: 'test-id',
          endpointUrl: '/api/marc/:recordId',
          enabled: false,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(baseApi.getJson).not.toHaveBeenCalled();
  });

  it('handles API errors', async () => {
    (baseApi.getJson as jest.Mock).mockRejectedValue(new Error('API Error'));
    (UserNotificationFactory.createMessage as jest.Mock).mockReturnValue({
      type: StatusType.error,
      content: 'ld.cantLoadMarc',
    });

    const { result } = renderHook(
      () =>
        useMarcQuery({
          recordId: 'test-id',
          endpointUrl: '/api/marc/:recordId',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockAddStatusMessagesItem).toHaveBeenCalled();
  });

  it('does not show error for AbortError', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    (baseApi.getJson as jest.Mock).mockRejectedValue(abortError);

    const { result } = renderHook(
      () =>
        useMarcQuery({
          recordId: 'test-id',
          endpointUrl: '/api/marc/:recordId',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockAddStatusMessagesItem).not.toHaveBeenCalled();
  });

  it('refetches data when refetch is called', async () => {
    (baseApi.getJson as jest.Mock).mockResolvedValue({ id: 'marc-123' } as MarcDTO);

    const { result } = renderHook(
      () =>
        useMarcQuery({
          recordId: 'test-id',
          endpointUrl: '/api/marc/:recordId',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(baseApi.getJson).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(baseApi.getJson).toHaveBeenCalledTimes(2);
  });
});
