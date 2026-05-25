import { act, renderHook } from '@testing-library/react';

import { useResourcePreviewQuery } from '@/features/resources';

import { useHubPreviewQuery } from './useHubPreviewQuery';

jest.mock('@/features/resources', () => ({
  ...jest.requireActual('@/features/resources'),
  useResourcePreviewQuery: jest.fn(),
}));

const mockUseResourcePreviewQuery = useResourcePreviewQuery as jest.Mock;

describe('useHubPreviewQuery', () => {
  const defaultQueryResult = {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  };

  beforeEach(() => {
    mockUseResourcePreviewQuery.mockReturnValue(defaultQueryResult);
  });

  test('returns null previewData and previewMeta initially', () => {
    const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

    expect(result.current.previewData).toBeNull();
    expect(result.current.previewMeta).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  describe('loadHubPreview', () => {
    test('sets selectedHubId and previewMeta', () => {
      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      act(() => {
        result.current.loadHubPreview('hub_1', 'Hub Title 1');
      });

      expect(result.current.previewMeta).toEqual({ id: 'hub_1', title: 'Hub Title 1' });
      expect(mockUseResourcePreviewQuery).toHaveBeenCalledWith('hub_1', 'hub-lookup', { enabled: true });
    });

    test('maps ProcessedResource to HubPreviewData', () => {
      const processedResource = {
        schema: new Map(),
        userValues: { key: 'value' },
        initKey: 'init_key_1',
        title: 'Hub Title 1',
        referenceIds: [],
        selectedEntries: [],
      };

      mockUseResourcePreviewQuery.mockReturnValue({ ...defaultQueryResult, data: processedResource });

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      act(() => {
        result.current.loadHubPreview('hub_1', 'Hub Title 1');
      });

      expect(result.current.previewData).toEqual({
        id: 'hub_1',
        resource: {
          base: processedResource.schema,
          userValues: processedResource.userValues,
          initKey: processedResource.initKey,
        },
      });
    });

    test('returns null previewData when data is null', () => {
      mockUseResourcePreviewQuery.mockReturnValue({ ...defaultQueryResult, data: null });

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      act(() => {
        result.current.loadHubPreview('hub_1', 'Hub Title 1');
      });

      expect(result.current.previewData).toBeNull();
    });
  });

  describe('resetPreview', () => {
    test('clears previewData and previewMeta', () => {
      const processedResource = {
        schema: new Map(),
        userValues: {},
        initKey: 'key',
        title: '',
        referenceIds: [],
        selectedEntries: [],
      };

      mockUseResourcePreviewQuery.mockReturnValue({ ...defaultQueryResult, data: processedResource });

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      act(() => {
        result.current.loadHubPreview('hub_1', 'Hub Title 1');
      });

      expect(result.current.previewMeta).not.toBeNull();

      act(() => {
        result.current.resetPreview();
      });

      expect(result.current.previewData).toBeNull();
      expect(result.current.previewMeta).toBeNull();
    });
  });

  describe('enabled parameter', () => {
    test('passes enabled: false when isPreviewOpen is false', () => {
      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: false }));

      act(() => {
        result.current.loadHubPreview('hub_1', 'Hub Title 1');
      });

      expect(mockUseResourcePreviewQuery).toHaveBeenCalledWith('hub_1', 'hub-lookup', { enabled: false });
    });

    test('passes enabled: true when isPreviewOpen is true', () => {
      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      act(() => {
        result.current.loadHubPreview('hub_5', 'Hub Title 5');
      });

      expect(mockUseResourcePreviewQuery).toHaveBeenCalledWith('hub_5', 'hub-lookup', { enabled: true });
    });
  });

  describe('loading and error states', () => {
    test('propagates isLoading state', () => {
      mockUseResourcePreviewQuery.mockReturnValue({ ...defaultQueryResult, isLoading: true });

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      expect(result.current.isLoading).toBe(true);
    });

    test('propagates isFetching state', () => {
      mockUseResourcePreviewQuery.mockReturnValue({ ...defaultQueryResult, isFetching: true });

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    test('propagates isError and error states', () => {
      const error = new Error('Network error');

      mockUseResourcePreviewQuery.mockReturnValue({ ...defaultQueryResult, isError: true, error });

      const { result } = renderHook(() => useHubPreviewQuery({ isPreviewOpen: true }));

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(error);
    });
  });
});
