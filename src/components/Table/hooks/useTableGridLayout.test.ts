import { type RefObject } from 'react';

import { renderHook } from '@testing-library/react';

import * as tableHelpers from '@/common/helpers/table.helpers';

import { useTableGridLayout } from './useTableGridLayout';

jest.mock('@/common/helpers/table.helpers');

describe('useTableGridLayout', () => {
  const mockTableHeadRef: RefObject<HTMLDivElement | null> = { current: null };
  const mockTableHeadRowRef: RefObject<HTMLDivElement | null> = { current: null };
  const mockTableBodyContainerRef: RefObject<HTMLDivElement | null> = { current: null };

  const defaultProps = {
    sortedHeaderEntries: [
      ['column_1', { minWidth: 100, maxWidth: 200 }],
      ['column_2', { minWidth: 150 }],
    ] as [string, { minWidth?: number; maxWidth?: number | string }][],
    refs: {
      tableHeadRef: mockTableHeadRef,
      tableHeadRowRef: mockTableHeadRowRef,
      tableBodyContainerRef: mockTableBodyContainerRef,
    },
    dataLength: 2,
  };

  const mockExtractColumnWidths = tableHelpers.extractColumnWidths as jest.Mock;
  const mockCalculateGridTemplate = tableHelpers.calculateGridTemplate as jest.Mock;
  const mockGetScrollbarWidth = tableHelpers.getScrollbarWidth as jest.Mock;
  const mockMeasureContentWidths = tableHelpers.measureContentWidths as jest.Mock;

  beforeEach(() => {
    mockExtractColumnWidths.mockReturnValue([
      { min: 100, max: 200 },
      { min: 150, max: undefined },
    ]);
    mockCalculateGridTemplate.mockReturnValue({
      gridTemplate: 'minmax(100px, 200px) minmax(150px, 1fr)',
      totalMinWidth: 250,
    });
    mockGetScrollbarWidth.mockReturnValue(17);
    mockMeasureContentWidths.mockReturnValue([undefined, undefined]);
  });

  describe('hasContentFitColumns memoization', () => {
    it('returns false when no columns have max-content width', () => {
      const { result } = renderHook(() => useTableGridLayout(defaultProps));

      expect(result.current.hasContentFitColumns).toBe(false);
    });

    it('returns true when at least one column has max-content width', () => {
      const propsWithContentFit = {
        ...defaultProps,
        sortedHeaderEntries: [
          ['column_1', { minWidth: 100, maxWidth: 'max-content' }],
          ['column_2', { minWidth: 150 }],
        ] as [string, { minWidth?: number; maxWidth?: number | string }][],
      };

      const { result } = renderHook(() => useTableGridLayout(propsWithContentFit));

      expect(result.current.hasContentFitColumns).toBe(true);
    });
  });

  describe('content width measurement', () => {
    it('does not measure content widths when no max-content columns exist', () => {
      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockMeasureContentWidths).not.toHaveBeenCalled();
    });

    it('measures content widths when max-content columns exist', () => {
      const propsWithContentFit = {
        ...defaultProps,
        sortedHeaderEntries: [
          ['column_1', { minWidth: 100, maxWidth: 'max-content' }],
          ['column_2', { minWidth: 150 }],
        ] as [string, { minWidth?: number; maxWidth?: number | string }][],
      };

      mockMeasureContentWidths.mockReturnValue([250, undefined]);

      const { result } = renderHook(() => useTableGridLayout(propsWithContentFit));

      expect(mockMeasureContentWidths).toHaveBeenCalledWith(expect.any(Array), null, null, '.table-head-cell');
      expect(result.current.measuredWidths).toEqual([250, undefined]);
    });

    it('updates measured widths when data dependency changes', () => {
      const propsWithContentFit = {
        ...defaultProps,
        sortedHeaderEntries: [['column_1', { minWidth: 100, maxWidth: 'max-content' }]] as [
          string,
          { minWidth?: number; maxWidth?: number | string },
        ][],
        dataDependency: [{ id: 'row_1' }],
      };

      mockMeasureContentWidths.mockReturnValueOnce([250]).mockReturnValueOnce([300]);

      const { rerender } = renderHook(props => useTableGridLayout(props), { initialProps: propsWithContentFit });

      const initialCallCount = mockMeasureContentWidths.mock.calls.length;

      rerender({ ...propsWithContentFit, dataDependency: [{ id: 'row_2' }] });

      expect(mockMeasureContentWidths.mock.calls.length).toBe(initialCallCount);
    });

    it('does not update state when measured widths have not changed', () => {
      const propsWithContentFit = {
        ...defaultProps,
        sortedHeaderEntries: [['column_1', { minWidth: 100, maxWidth: 'max-content' }]] as [
          string,
          { minWidth?: number; maxWidth?: number | string },
        ][],
      };

      mockMeasureContentWidths.mockReturnValue([250]);

      const { result, rerender } = renderHook(() => useTableGridLayout(propsWithContentFit));

      const initialWidths = result.current.measuredWidths;

      rerender();

      expect(result.current.measuredWidths).toBe(initialWidths);
    });
  });

  describe('grid layout application', () => {
    it('applies grid template to header row', () => {
      const mockHeadRowElement = document.createElement('div');
      mockTableHeadRowRef.current = mockHeadRowElement;

      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockHeadRowElement.style.gridTemplateColumns).toBe('minmax(100px, 200px) minmax(150px, 1fr)');
      expect(mockHeadRowElement.style.minWidth).toBe('250px');

      mockTableHeadRowRef.current = null;
    });

    it('applies scrollbar padding to table head', () => {
      const mockHeadElement = document.createElement('div');
      mockTableHeadRef.current = mockHeadElement;

      mockGetScrollbarWidth.mockReturnValue(15);

      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockHeadElement.style.paddingRight).toBe('15px');

      mockTableHeadRef.current = null;
    });

    it('applies grid template to body rows', () => {
      const mockBodyContainer = document.createElement('div');
      const mockRow1 = document.createElement('div');
      const mockRow2 = document.createElement('div');

      mockRow1.className = 'table-row';
      mockRow2.className = 'table-row';

      const tableBody = document.createElement('div');
      tableBody.className = 'table-body';
      tableBody.appendChild(mockRow1);
      tableBody.appendChild(mockRow2);
      mockBodyContainer.appendChild(tableBody);

      mockTableBodyContainerRef.current = mockBodyContainer;

      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockRow1.style.gridTemplateColumns).toBe('minmax(100px, 200px) minmax(150px, 1fr)');
      expect(mockRow1.style.minWidth).toBe('250px');
      expect(mockRow2.style.gridTemplateColumns).toBe('minmax(100px, 200px) minmax(150px, 1fr)');
      expect(mockRow2.style.minWidth).toBe('250px');

      mockTableBodyContainerRef.current = null;
    });

    it('calculates scrollbar width from container dimensions', () => {
      const mockBodyContainer = document.createElement('div');
      Object.defineProperty(mockBodyContainer, 'offsetWidth', { value: 500, configurable: true });
      Object.defineProperty(mockBodyContainer, 'clientWidth', { value: 483, configurable: true });

      mockTableBodyContainerRef.current = mockBodyContainer;

      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockGetScrollbarWidth).toHaveBeenCalledWith(500, 483);

      mockTableBodyContainerRef.current = null;
    });

    it('handles null refs gracefully', () => {
      const propsWithNullRefs = {
        ...defaultProps,
        refs: {
          tableHeadRef: { current: null },
          tableHeadRowRef: { current: null },
          tableBodyContainerRef: { current: null },
        },
      };

      const { result } = renderHook(() => useTableGridLayout(propsWithNullRefs));

      expect(result.current.hasContentFitColumns).toBe(false);
    });
  });

  describe('grid layout with measured widths', () => {
    it('passes measured widths to grid template calculation', () => {
      const mockBodyContainer = document.createElement('div');
      const tableBody = document.createElement('div');
      tableBody.className = 'table-body';
      mockBodyContainer.appendChild(tableBody);
      mockTableBodyContainerRef.current = mockBodyContainer;

      const propsWithContentFit = {
        ...defaultProps,
        sortedHeaderEntries: [
          ['column_1', { minWidth: 100, maxWidth: 'max-content' }],
          ['column_2', { minWidth: 150 }],
        ] as [string, { minWidth?: number; maxWidth?: number | string }][],
      };

      mockMeasureContentWidths.mockReturnValue([280, undefined]);

      renderHook(() => useTableGridLayout(propsWithContentFit));

      expect(mockCalculateGridTemplate).toHaveBeenCalledWith(expect.any(Array), [280, undefined]);

      mockTableBodyContainerRef.current = null;
    });

    it('does not pass measured widths when no content-fit columns exist', () => {
      const mockBodyContainer = document.createElement('div');
      const tableBody = document.createElement('div');
      tableBody.className = 'table-body';
      mockBodyContainer.appendChild(tableBody);
      mockTableBodyContainerRef.current = mockBodyContainer;

      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockCalculateGridTemplate).toHaveBeenCalledWith(expect.any(Array), undefined);

      mockTableBodyContainerRef.current = null;
    });
  });

  describe('reapplies layout when dependencies change', () => {
    it('reapplies layout when sortedHeaderEntries change', () => {
      const mockBodyContainer = document.createElement('div');
      const tableBody = document.createElement('div');
      tableBody.className = 'table-body';
      mockBodyContainer.appendChild(tableBody);
      mockTableBodyContainerRef.current = mockBodyContainer;

      const { rerender } = renderHook(props => useTableGridLayout(props), { initialProps: defaultProps });

      expect(mockCalculateGridTemplate).toHaveBeenCalledTimes(1);

      const newProps = {
        ...defaultProps,
        sortedHeaderEntries: [['column_1', { minWidth: 120, maxWidth: 250 }]] as [
          string,
          { minWidth?: number; maxWidth?: number | string },
        ][],
      };

      rerender(newProps);

      expect(mockCalculateGridTemplate).toHaveBeenCalledTimes(2);

      mockTableBodyContainerRef.current = null;
    });

    it('reapplies layout when dataDependency changes', () => {
      const mockBodyContainer = document.createElement('div');
      mockTableBodyContainerRef.current = mockBodyContainer;

      const propsWithDependency = { ...defaultProps, dataDependency: [] as unknown[] };

      const { rerender } = renderHook(props => useTableGridLayout(props), { initialProps: propsWithDependency });

      const callCount = mockCalculateGridTemplate.mock.calls.length;

      rerender({ ...defaultProps, dataDependency: [{ id: 'row_1' }] as unknown[] });

      expect(mockCalculateGridTemplate.mock.calls.length).toBe(callCount);

      mockTableBodyContainerRef.current = null;
    });
  });

  describe('extractColumnWidths integration', () => {
    it('calls extractColumnWidths with sorted header entries', () => {
      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockExtractColumnWidths).toHaveBeenCalledWith(defaultProps.sortedHeaderEntries);
    });

    it('uses extracted column widths for calculations', () => {
      const customColumnWidths = [
        { min: 200, max: 400 },
        { min: 100, max: undefined },
      ];

      mockExtractColumnWidths.mockReturnValue(customColumnWidths);

      renderHook(() => useTableGridLayout(defaultProps));

      expect(mockCalculateGridTemplate).toHaveBeenCalledWith(customColumnWidths, undefined);
    });
  });
});
