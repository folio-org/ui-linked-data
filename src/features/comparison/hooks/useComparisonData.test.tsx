import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import * as fetchAndBuildPreviewModule from '@/features/resources';

import { useComparisonData } from './useComparisonData';

jest.mock('@/features/resources', () => ({
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

describe('useComparisonData', () => {
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

  it('returns empty items and isLoading false for empty resourceIds', async () => {
    const { result } = renderHook(() => useComparisonData([]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toHaveLength(0);
    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).not.toHaveBeenCalled();
  });

  it('calls fetchAndBuildPreview once for a single resourceId and maps result', async () => {
    const mockData = { schema: { key: 1 }, userValues: {} };
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useComparisonData(['res-1']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).toHaveBeenCalledTimes(1);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('res-1');
    expect(result.current.items[0].data).toEqual(mockData);
  });

  it('calls fetchAndBuildPreview for each resourceId in parallel', async () => {
    const mockData1 = { schema: { key: 1 } };
    const mockData2 = { schema: { key: 2 } };
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock)
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useComparisonData(['res-1', 'res-2']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchAndBuildPreviewModule.fetchAndBuildPreview).toHaveBeenCalledTimes(2);
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].id).toBe('res-1');
    expect(result.current.items[1].id).toBe('res-2');
    expect(result.current.items[0].data).toEqual(mockData1);
    expect(result.current.items[1].data).toEqual(mockData2);
  });

  it('sets data to null for a failed query', async () => {
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock).mockRejectedValue(new Error('fetch failed'));

    const { result } = renderHook(() => useComparisonData(['res-fail']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items[0].data).toBeNull();
  });

  it('preserves correct id for each item regardless of fetch order', async () => {
    (fetchAndBuildPreviewModule.fetchAndBuildPreview as jest.Mock).mockResolvedValue({ schema: {} });

    const ids = ['id-a', 'id-b', 'id-c'];
    const { result } = renderHook(() => useComparisonData(ids), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    ids.forEach((id, i) => {
      expect(result.current.items[i].id).toBe(id);
    });
  });
});
