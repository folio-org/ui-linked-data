import { renderHook } from '@testing-library/react';
import { useMarcAssignment } from '@common/hooks/useMarcAssignment';
import { useMarcData } from '@common/hooks/useMarcData';

jest.mock('@common/hooks/useMarcData');

describe('useMarcAssignment', () => {
  const mockFetchMarcData = jest.fn();
  const mockSetMarcPreviewData = jest.fn();

  beforeEach(() => {
    (useMarcData as jest.Mock).mockReturnValue({
      fetchMarcData: mockFetchMarcData,
    });
  });

  test('returns getMarcDataForAssignment function', () => {
    const { result } = renderHook(() => useMarcAssignment(mockSetMarcPreviewData));

    expect(typeof result.current.getMarcDataForAssignment).toBe('function');
  });

  test('getMarcDataForAssignment returns existing marcData when marcPreviewMetadata matches', async () => {
    const mockOptions = {
      complexValue: { test: 'existing-data' } as unknown as MarcDTO,
      marcPreviewMetadata: {
        baseId: 'test-id',
        srsId: 'existing-srs-id',
      } as MarcPreviewMetadata,
      marcPreviewEndpoint: 'test-endpoint',
    };

    const { result } = renderHook(() => useMarcAssignment(mockSetMarcPreviewData));

    const response = await result.current.getMarcDataForAssignment('test-id', mockOptions);

    expect(response).toEqual({
      srsId: 'existing-srs-id',
      marcData: { test: 'existing-data' },
    });
    expect(mockFetchMarcData).not.toHaveBeenCalled();
  });

  test('getMarcDataForAssignment fetches new data when marcPreviewMetadata does not match', async () => {
    const mockFetchedData = {
      matchedId: 'fetched-srs-id',
      test: 'fetched-data',
    } as unknown as MarcDTO;

    mockFetchMarcData.mockResolvedValue(mockFetchedData);

    const mockOptions = {
      complexValue: { test: 'existing-data' } as unknown as MarcDTO,
      marcPreviewMetadata: {
        baseId: 'different-id',
        srsId: 'existing-srs-id',
      } as MarcPreviewMetadata,
      marcPreviewEndpoint: 'test-endpoint',
    };

    const { result } = renderHook(() => useMarcAssignment(mockSetMarcPreviewData));

    const response = await result.current.getMarcDataForAssignment('test-id', mockOptions);

    expect(mockFetchMarcData).toHaveBeenCalledWith('test-id', 'test-endpoint');
    expect(response).toEqual({
      srsId: 'fetched-srs-id',
      marcData: mockFetchedData,
    });
  });

  test('getMarcDataForAssignment handles fetch failure gracefully', async () => {
    mockFetchMarcData.mockResolvedValue(undefined);

    const mockOptions = {
      complexValue: { test: 'existing-data' } as unknown as MarcDTO,
      marcPreviewMetadata: {
        baseId: 'different-id',
        srsId: 'existing-srs-id',
      } as MarcPreviewMetadata,
      marcPreviewEndpoint: 'test-endpoint',
    };

    const { result } = renderHook(() => useMarcAssignment(mockSetMarcPreviewData));

    const response = await result.current.getMarcDataForAssignment('test-id', mockOptions);

    expect(mockFetchMarcData).toHaveBeenCalledWith('test-id', 'test-endpoint');
    expect(response).toEqual({
      srsId: undefined,
      marcData: { test: 'existing-data' },
    });
  });

  test('getMarcDataForAssignment works with null complexValue', async () => {
    const mockFetchedData = {
      matchedId: 'fetched-srs-id',
      test: 'fetched-data',
    } as unknown as MarcDTO;

    mockFetchMarcData.mockResolvedValue(mockFetchedData);

    const mockOptions = {
      complexValue: null,
      marcPreviewMetadata: null,
      marcPreviewEndpoint: 'test-endpoint',
    };

    const { result } = renderHook(() => useMarcAssignment(mockSetMarcPreviewData));

    const response = await result.current.getMarcDataForAssignment('test-id', mockOptions);

    expect(mockFetchMarcData).toHaveBeenCalledWith('test-id', 'test-endpoint');
    expect(response).toEqual({
      srsId: 'fetched-srs-id',
      marcData: mockFetchedData,
    });
  });
});
