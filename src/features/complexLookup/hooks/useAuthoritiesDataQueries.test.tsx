import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import baseApi from '@/common/api/base.api';
import { useAuthoritiesDataQueries } from './useAuthoritiesDataQueries';

jest.mock('@/common/api/base.api');

const delayedResolve = (data: unknown, delay: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuthoritiesDataQueries', () => {
  const mockSourceData = { id: 'source-1', name: 'Test Source' };
  const mockFacetsData = { facets: [{ id: 'facet-1', name: 'Test Facet' }] };

  it('returns initial state with loading false when queries are not enabled', () => {
    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
          facetsEndpoint: '/api/facets',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.sourceData).toBeUndefined();
    expect(result.current.facetsData).toBeUndefined();
    expect(result.current.isSourceLoading).toBe(false);
    expect(result.current.isFacetsLoading).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches source data when refetchSource is called', async () => {
    (baseApi.getJson as jest.Mock).mockResolvedValue(mockSourceData);

    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
          facetsEndpoint: '/api/facets',
        }),
      { wrapper: createWrapper() },
    );

    result.current.refetchSource();

    await waitFor(() => {
      expect(result.current.sourceData).toEqual(mockSourceData);
    });

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/api/source',
      sameOrigin: true,
    });
  });

  it('fetches facets data when refetchFacets is called', async () => {
    (baseApi.getJson as jest.Mock).mockResolvedValue(mockFacetsData);

    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
          facetsEndpoint: '/api/facets',
        }),
      { wrapper: createWrapper() },
    );

    result.current.refetchFacets();

    await waitFor(() => {
      expect(result.current.facetsData).toEqual(mockFacetsData);
    });

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/api/facets',
      urlParams: { query: 'id=*' },
      sameOrigin: true,
    });
  });

  it('includes facet parameter when provided', async () => {
    (baseApi.getJson as jest.Mock).mockResolvedValue(mockFacetsData);

    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
          facetsEndpoint: '/api/facets',
          facet: 'authoritySource',
        }),
      { wrapper: createWrapper() },
    );

    result.current.refetchFacets();

    await waitFor(() => {
      expect(result.current.facetsData).toEqual(mockFacetsData);
    });

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/api/facets',
      urlParams: { query: 'id=*', facet: 'authoritySource' },
      sameOrigin: true,
    });
  });

  it('handles missing source endpoint', () => {
    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          facetsEndpoint: '/api/facets',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.refetchSource).toBeDefined();
  });

  it('handles missing facets endpoint', () => {
    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.refetchFacets).toBeDefined();
  });

  it('updates isLoading when fetching data', async () => {
    (baseApi.getJson as jest.Mock).mockImplementation(() => delayedResolve(mockSourceData, 100));

    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
          facetsEndpoint: '/api/facets',
        }),
      { wrapper: createWrapper() },
    );

    result.current.refetchSource();

    await waitFor(() => {
      expect(result.current.isSourceLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isSourceLoading).toBe(false);
    });
  });

  it('handles combined loading state correctly', async () => {
    (baseApi.getJson as jest.Mock).mockImplementation(() => delayedResolve(mockSourceData, 100));

    const { result } = renderHook(
      () =>
        useAuthoritiesDataQueries({
          sourceEndpoint: '/api/source',
          facetsEndpoint: '/api/facets',
        }),
      { wrapper: createWrapper() },
    );

    result.current.refetchSource();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
