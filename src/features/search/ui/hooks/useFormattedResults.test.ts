import { renderHook } from '@testing-library/react';

import { logger } from '@/common/services/logger';

import * as SearchProvider from '../providers/SearchProvider';
import * as useCommittedSearchParamsHook from './useCommittedSearchParams';
import { useFormattedResults } from './useFormattedResults';

jest.mock('../providers/SearchProvider');
jest.mock('./useCommittedSearchParams');
jest.mock('@/common/services/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

const mockUseSearchContext = SearchProvider.useSearchContext as jest.Mock;
const mockUseCommittedSearchParams = useCommittedSearchParamsHook.useCommittedSearchParams as jest.Mock;

describe('useFormattedResults', () => {
  const mockResultFormatter = {
    format: jest.fn(),
  };

  const mockConfig = {
    strategies: {
      resultFormatter: mockResultFormatter,
    },
  };

  const mockFlow = 'search';

  beforeEach(() => {
    mockUseCommittedSearchParams.mockReturnValue({ offset: 0 });
  });

  test('returns undefined when results are not available', () => {
    mockUseSearchContext.mockReturnValue({
      results: null,
      config: mockConfig,
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults());

    expect(result.current).toBeUndefined();
  });

  test('returns undefined when results.items is undefined', () => {
    mockUseSearchContext.mockReturnValue({
      results: {},
      config: mockConfig,
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults());

    expect(result.current).toBeUndefined();
  });

  test('returns undefined when config is not available', () => {
    mockUseSearchContext.mockReturnValue({
      results: { items: [{ id: '1' }] },
      config: null,
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults());

    expect(result.current).toBeUndefined();
  });

  test('returns undefined when resultFormatter is not available', () => {
    mockUseSearchContext.mockReturnValue({
      results: { items: [{ id: '1' }] },
      config: { strategies: {} },
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults());

    expect(result.current).toBeUndefined();
  });

  test('returns formatted results when all dependencies are available', () => {
    const mockItems = [{ id: '1', title: 'Test 1' }];
    const mockFormattedItems = [{ id: '1', title: 'Formatted Test 1' }];

    mockResultFormatter.format.mockReturnValue(mockFormattedItems);
    mockUseSearchContext.mockReturnValue({
      results: { items: mockItems },
      config: mockConfig,
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults());

    expect(mockResultFormatter.format).toHaveBeenCalledWith(mockItems);
    expect(result.current).toEqual(mockFormattedItems);
  });

  test('handles formatting errors gracefully', () => {
    const mockItems = [{ id: '1' }];
    const error = new Error('Formatting error');

    mockResultFormatter.format.mockImplementation(() => {
      throw error;
    });

    mockUseSearchContext.mockReturnValue({
      results: { items: mockItems },
      config: mockConfig,
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults());

    expect(logger.error).toHaveBeenCalledWith('Error formatting search results:', error);
    expect(result.current).toBeUndefined();
  });

  test('re-formats results when items change', () => {
    const mockItems1 = [{ id: '1' }];
    const mockItems2 = [{ id: '2' }];
    const mockFormatted1 = [{ id: '1', formatted: true }];
    const mockFormatted2 = [{ id: '2', formatted: true }];

    mockResultFormatter.format.mockReturnValueOnce(mockFormatted1).mockReturnValueOnce(mockFormatted2);

    mockUseSearchContext.mockReturnValue({
      results: { items: mockItems1 },
      config: mockConfig,
      flow: mockFlow,
    });

    const { result, rerender } = renderHook(() => useFormattedResults());

    expect(result.current).toEqual(mockFormatted1);

    mockUseSearchContext.mockReturnValue({
      results: { items: mockItems2 },
      config: mockConfig,
      flow: mockFlow,
    });

    rerender();

    expect(result.current).toEqual(mockFormatted2);
    expect(mockResultFormatter.format).toHaveBeenCalledTimes(2);
  });

  test('returns typed results', () => {
    interface CustomResultType {
      customId: string;
      customTitle: string;
    }

    const mockItems = [{ id: '1' }];
    const mockFormatted: CustomResultType[] = [{ customId: '1', customTitle: 'Custom' }];

    mockResultFormatter.format.mockReturnValue(mockFormatted);
    mockUseSearchContext.mockReturnValue({
      results: { items: mockItems },
      config: mockConfig,
      flow: mockFlow,
    });

    const { result } = renderHook(() => useFormattedResults<CustomResultType>());

    expect(result.current).toEqual(mockFormatted);
    expect(result.current?.[0].customId).toBe('1');
  });
});
