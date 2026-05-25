import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import * as fetchAndBuildPreviewModule from './fetchAndBuildPreview';
import { useResourcePreviewQuery } from './useResourcePreviewQuery';

jest.mock('./fetchAndBuildPreview', () => ({
  fetchAndBuildPreview: jest.fn(),
}));

jest.mock('@/contexts', () => ({
  SharedInfraContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
  },
}));

jest.mock('@/features/profiles/hooks/useLoadProfile', () => ({
  useLoadProfile: () => ({ loadProfile: jest.fn() }),
}));

jest.mock('@/features/profiles/hooks/useLoadProfileSettings', () => ({
  useLoadProfileSettings: () => ({ loadProfileSettings: jest.fn() }),
}));

describe('useResourcePreviewQuery', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

  afterEach(() => {
    queryClient?.clear();
  });

  it('does not call fetchAndBuildPreview when resourceId is undefined', async () => {
    const { result } = renderHook(() => useResourcePreviewQuery(undefined, 'edit-link'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it('does not call fetchAndBuildPreview when options.enabled is false', async () => {
    const { result } = renderHook(() => useResourcePreviewQuery('res-1', 'edit-link', { enabled: false }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).not.toHaveBeenCalled();
  });

  it('calls fetchAndBuildPreview with the provided resourceId', async () => {
    const mockData = {
      schema: {},
      userValues: {},
    } as unknown as import('./fetchAndBuildPreview').FetchAndBuildPreviewParams;
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useResourcePreviewQuery('res-1', 'hub-lookup'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).toHaveBeenCalledWith(
      expect.objectContaining({ resourceId: 'res-1' }),
    );
  });

  it('forwards idType to fetchAndBuildPreview', async () => {
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(
      () =>
        useResourcePreviewQuery('res-1', 'search-preview', {
          idType: 'INVENTORY_ID' as import('@/common/constants/api.constants').ExternalResourceIdType,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).toHaveBeenCalledWith(
      expect.objectContaining({ idType: 'INVENTORY_ID' }),
    );
  });

  it('stores result under the expected query key', async () => {
    const mockResult = { schema: { key: 1 } };
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useResourcePreviewQuery('res-1', 'comparison'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cached = queryClient.getQueryData(['preview', 'comparison', 'res-1']);
    expect(cached).toEqual(mockResult);
  });
});
