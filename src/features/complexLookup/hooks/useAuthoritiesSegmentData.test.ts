import { renderHook, waitFor } from '@testing-library/react';

import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useLoadingState, useSearchState } from '@/store';

import { useAuthoritiesDataQueries } from './useAuthoritiesDataQueries';
import { useAuthoritiesSegmentData } from './useAuthoritiesSegmentData';

jest.mock('@/common/api/base.api');
jest.mock('./useAuthoritiesDataQueries');

describe('useAuthoritiesSegmentData', () => {
  const mockConfig = {
    sourceEndpoint: '/search/authorities/source',
    facetsEndpoint: '/search/authorities/facets',
    sourceKey: 'authorities',
    facet: 'sourceFileId',
    autoLoadOnMount: false,
  };

  const mockSetSourceData = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockRefetchSource = jest.fn();
  const mockRefetchFacets = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchState,
        state: {
          setSourceData: mockSetSourceData,
        },
      },
      {
        store: useLoadingState,
        state: {
          setIsLoading: mockSetIsLoading,
        },
      },
    ]);

    (useAuthoritiesDataQueries as jest.Mock).mockReturnValue({
      sourceData: { sourceData: 'mock-source' },
      facetsData: { facetsData: 'mock-facets' },
      isLoading: false,
      isSourceLoading: false,
      isFacetsLoading: false,
      refetchSource: mockRefetchSource,
      refetchFacets: mockRefetchFacets,
    });
  });

  it('should initialize hook with data fetching disabled', () => {
    const { result } = renderHook(() => useAuthoritiesSegmentData(mockConfig));

    expect(result.current).toBeDefined();
    expect(result.current.onSegmentEnter).toBeDefined();
    expect(typeof result.current.onSegmentEnter).toBe('function');
    expect(result.current.refetchSource).toBeDefined();
    expect(typeof result.current.refetchSource).toBe('function');
    expect(result.current.refetchFacets).toBeDefined();
    expect(typeof result.current.refetchFacets).toBe('function');
  });

  it('should call refetch methods when onSegmentEnter is invoked for browse segment (no caching)', async () => {
    mockRefetchSource.mockResolvedValue({ data: { test: 'source-data' } });
    mockRefetchFacets.mockResolvedValue({ data: { test: 'facets-data' } });

    const { result } = renderHook(() => useAuthoritiesSegmentData(mockConfig));

    await result.current.onSegmentEnter();

    await waitFor(() => {
      expect(mockRefetchSource).toHaveBeenCalled();
      expect(mockRefetchFacets).toHaveBeenCalled();
    });

    // Call again to verify no caching - should refetch
    mockRefetchSource.mockClear();
    mockRefetchFacets.mockClear();
    mockRefetchSource.mockResolvedValue({ data: { test: 'source-data-2' } });
    mockRefetchFacets.mockResolvedValue({ data: { test: 'facets-data-2' } });

    await result.current.onSegmentEnter();

    await waitFor(() => {
      expect(mockRefetchSource).toHaveBeenCalled();
      expect(mockRefetchFacets).toHaveBeenCalled();
    });
  });

  it('should call refetch methods when onSegmentEnter is invoked for search segment', async () => {
    mockRefetchSource.mockResolvedValue({ data: { test: 'source-data' } });
    mockRefetchFacets.mockResolvedValue({ data: { test: 'facets-data' } });

    const { result } = renderHook(() => useAuthoritiesSegmentData(mockConfig));

    await result.current.onSegmentEnter();

    await waitFor(() => {
      expect(mockRefetchSource).toHaveBeenCalled();
      expect(mockRefetchFacets).toHaveBeenCalled();
    });
  });

  it('should handle errors gracefully in onSegmentEnter', async () => {
    const mockError = new Error('Fetch failed');
    mockRefetchSource.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthoritiesSegmentData(mockConfig));

    await expect(result.current.onSegmentEnter()).rejects.toThrow('Fetch failed');
  });

  it('should auto-load data on mount when autoLoadOnMount is true and initialSegment is browse', async () => {
    mockRefetchSource.mockResolvedValue({ data: { test: 'source-data' } });
    mockRefetchFacets.mockResolvedValue({ data: { test: 'facets-data' } });

    const configWithAutoLoad = {
      ...mockConfig,
      autoLoadOnMount: true,
      initialSegment: 'authorities:browse',
      isOpen: true,
    };

    renderHook(() => useAuthoritiesSegmentData(configWithAutoLoad));

    await waitFor(() => {
      expect(mockRefetchSource).toHaveBeenCalled();
      expect(mockRefetchFacets).toHaveBeenCalled();
    });
  });

  it('should auto-load data on mount when initialSegment is search', async () => {
    mockRefetchSource.mockResolvedValue({ data: { test: 'source-data' } });
    mockRefetchFacets.mockResolvedValue({ data: { test: 'facets-data' } });

    const configWithAutoLoad = {
      ...mockConfig,
      autoLoadOnMount: true,
      initialSegment: 'authorities:search',
      isOpen: true,
    };

    renderHook(() => useAuthoritiesSegmentData(configWithAutoLoad));

    await waitFor(() => {
      expect(mockRefetchSource).toHaveBeenCalled();
      expect(mockRefetchFacets).toHaveBeenCalled();
    });
  });

  it('should not auto-load data when autoLoadOnMount is false', async () => {
    const configWithoutAutoLoad = {
      ...mockConfig,
      autoLoadOnMount: false,
      initialSegment: 'authorities:browse',
    };

    renderHook(() => useAuthoritiesSegmentData(configWithoutAutoLoad));

    await waitFor(() => {
      expect(mockRefetchSource).not.toHaveBeenCalled();
      expect(mockRefetchFacets).not.toHaveBeenCalled();
    });
  });
});
