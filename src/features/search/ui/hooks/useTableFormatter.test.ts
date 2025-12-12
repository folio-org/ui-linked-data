import { renderHook } from '@testing-library/react';
import { useTableFormatter } from './useTableFormatter';
import { FullDisplayType } from '@/common/constants/uiElements.constants';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id }) => `formatted.${id}`),
  }),
}));

describe('useTableFormatter', () => {
  const mockTableConfig: SearchResultsTableConfig = {
    columns: {
      title: {
        label: 'ld.title',
        position: 1,
        className: 'title-column',
        formatter: jest.fn(({ row }) => row.title.label),
      },
      author: {
        label: 'ld.author',
        position: 2,
        className: 'author-column',
        formatter: jest.fn(({ row }) => row.author?.label),
      },
      assign: {
        label: 'ld.assign',
        position: 0,
        className: 'assign-column',
        formatter: jest.fn(() => 'Assign'),
      },
    },
  };

  const mockData: SearchResultsTableRow[] = [
    {
      title: { label: 'Test Title 1' },
      author: { label: 'Test Author 1' },
      __meta: { id: '1', key: '1' },
    },
    {
      title: { label: 'Test Title 2' },
      author: { label: 'Test Author 2' },
      __meta: { id: '2', key: '2' },
    },
  ];

  test('formats data with column formatters', () => {
    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(result.current.formattedData).toHaveLength(2);
    expect(mockTableConfig.columns.title.formatter).toHaveBeenCalled();
    expect(mockTableConfig.columns.author.formatter).toHaveBeenCalled();
  });

  test('skips assign column in search context', () => {
    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(result.current.listHeader.assign).toBeUndefined();
  });

  test('includes assign column in complexLookup context', () => {
    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'complexLookup',
      }),
    );

    expect(result.current.listHeader.assign).toBeDefined();
    expect(result.current.listHeader.assign.label).toBe('formatted.ld.assign');
  });

  test('generates list header with formatted labels', () => {
    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(result.current.listHeader.title).toEqual({
      label: 'formatted.ld.title',
      position: 0,
      className: 'title-column',
      minWidth: undefined,
      maxWidth: undefined,
    });

    expect(result.current.listHeader.author).toEqual({
      label: 'formatted.ld.author',
      position: 1,
      className: 'author-column',
      minWidth: undefined,
      maxWidth: undefined,
    });
  });

  test('adjusts positions when assign column is skipped', () => {
    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(result.current.listHeader.title.position).toBe(0);
    expect(result.current.listHeader.author.position).toBe(1);
  });

  test('passes all formatter props correctly', () => {
    const onAssign = jest.fn();
    const onTitleClick = jest.fn();
    const checkFailedId = jest.fn();
    const onPreview = jest.fn();
    const onEdit = jest.fn();
    const onToggleSelect = jest.fn();
    const selectedInstances = ['1', '2'];
    const previewContent = [{ id: '1' }];

    renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'complexLookup',
        onAssign,
        onTitleClick,
        checkFailedId,
        onPreview,
        onEdit,
        onToggleSelect,
        selectedInstances,
        previewContent,
        fullDisplayComponentType: FullDisplayType.Comparison,
      }),
    );

    expect(mockTableConfig.columns.title.formatter).toHaveBeenCalledWith(
      expect.objectContaining({
        row: mockData[0],
        onAssign,
        onTitleClick,
        checkFailedId,
        onPreview,
        onEdit,
        onToggleSelect,
        selectedInstances,
        previewContent,
        fullDisplayComponentType: FullDisplayType.Comparison,
      }),
    );
  });

  test('handles columns without formatters', () => {
    const configWithoutFormatter: SearchResultsTableConfig = {
      columns: {
        title: {
          label: 'ld.title',
          position: 1,
        },
      },
    };

    const { result: hookResult } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: configWithoutFormatter,
        context: 'search',
      }),
    );

    expect(hookResult.current.formattedData[0].title.children).toBe('Test Title 1');
  });

  test('handles empty data array', () => {
    const { result: hookResult } = renderHook(() =>
      useTableFormatter({
        data: [],
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(hookResult.current.formattedData).toEqual([]);
  });

  test('handles undefined data gracefully', () => {
    const { result: hookResult } = renderHook(() =>
      useTableFormatter({
        data: undefined as unknown as SearchResultsTableRow[],
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(hookResult.current.formattedData).toEqual([]);
  });

  test('includes minWidth and maxWidth in list header', () => {
    const configWithDimensions: SearchResultsTableConfig = {
      columns: {
        title: {
          label: 'ld.title',
          position: 1,
          minWidth: '200px',
          maxWidth: '500px',
        },
      },
    };

    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: configWithDimensions,
        context: 'search',
      }),
    );

    expect(result.current.listHeader.title.minWidth).toBe('200px');
    expect(result.current.listHeader.title.maxWidth).toBe('500px');
  });

  test('uses default checkFailedId when not provided', () => {
    renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(mockTableConfig.columns.title.formatter).toHaveBeenCalledWith(
      expect.objectContaining({
        checkFailedId: expect.any(Function),
      }),
    );

    const checkFailedId = (mockTableConfig.columns.title.formatter as jest.Mock).mock.calls[0][0].checkFailedId;
    expect(checkFailedId('any-id')).toBe(false);
  });

  test('memoizes formatted data based on dependencies', () => {
    jest.clearAllMocks();

    const { result: hookResult, rerender } = renderHook(
      ({ data }) =>
        useTableFormatter({
          data,
          tableConfig: mockTableConfig,
          context: 'search',
        }),
      { initialProps: { data: mockData } },
    );

    const firstResult = hookResult.current.formattedData;

    rerender({ data: mockData });

    // Should return same data structure when data reference hasn't changed
    expect(hookResult.current.formattedData).toEqual(firstResult);
  });

  test('re-formats when data changes', () => {
    const { result: hookResult, rerender } = renderHook(
      ({ data }) =>
        useTableFormatter({
          data,
          tableConfig: mockTableConfig,
          context: 'search',
        }),
      { initialProps: { data: mockData } },
    );

    const firstResult = hookResult.current.formattedData;

    const newData = [
      {
        title: { label: 'New Title' },
        author: { label: 'New Author' },
        __meta: { id: '3', key: '3' },
      },
    ];

    rerender({ data: newData });

    expect(hookResult.current.formattedData).not.toBe(firstResult);
    expect(hookResult.current.formattedData).toHaveLength(1);
  });

  test('preserves row __meta in formatted data', () => {
    const { result } = renderHook(() =>
      useTableFormatter({
        data: mockData,
        tableConfig: mockTableConfig,
        context: 'search',
      }),
    );

    expect(result.current.formattedData[0].__meta).toEqual({ id: '1', key: '1' });
    expect(result.current.formattedData[1].__meta).toEqual({ id: '2', key: '2' });
  });
});
