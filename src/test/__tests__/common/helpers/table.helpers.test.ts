import {
  calculateGridTemplate,
  extractColumnWidths,
  getScrollbarWidth,
  measureContentWidths,
} from '@common/helpers/table.helpers';

describe('table.helpers', () => {
  describe('extractColumnWidths', () => {
    it('should extract minWidth values from header entries', () => {
      const headerEntries: [string, { minWidth?: number; maxWidth?: number }][] = [
        ['col_1', { minWidth: 100 }],
        ['col_2', { minWidth: 200 }],
        ['col_3', { minWidth: 150 }],
      ];

      const result = extractColumnWidths(headerEntries);

      expect(result).toEqual([
        { min: 100, max: undefined },
        { min: 200, max: undefined },
        { min: 150, max: undefined },
      ]);
    });

    it('should extract both minWidth and maxWidth values', () => {
      const headerEntries: [string, { minWidth?: number; maxWidth?: number }][] = [
        ['col_1', { minWidth: 100, maxWidth: 100 }],
        ['col_2', { minWidth: 200, maxWidth: 300 }],
        ['col_3', { minWidth: 150 }],
      ];

      const result = extractColumnWidths(headerEntries);

      expect(result).toEqual([
        { min: 100, max: 100 },
        { min: 200, max: 300 },
        { min: 150, max: undefined },
      ]);
    });

    it('should use default width when minWidth is not specified', () => {
      const headerEntries: [string, { minWidth?: number; maxWidth?: number }][] = [
        ['col_1', { minWidth: 100 }],
        ['col_2', {}],
        ['col_3', { minWidth: 150, maxWidth: 200 }],
      ];

      const result = extractColumnWidths(headerEntries);

      expect(result).toEqual([
        { min: 100, max: undefined },
        { min: 100, max: undefined },
        { min: 150, max: 200 },
      ]);
    });

    it('should use custom default width', () => {
      const headerEntries: [string, { minWidth?: number; maxWidth?: number }][] = [
        ['col_1', {}],
        ['col_2', { maxWidth: 250 }],
      ];

      const result = extractColumnWidths(headerEntries, 200);

      expect(result).toEqual([
        { min: 200, max: undefined },
        { min: 200, max: 250 },
      ]);
    });

    it('should handle empty array', () => {
      const result = extractColumnWidths([]);

      expect(result).toEqual([]);
    });
  });

  describe('calculateGridTemplate', () => {
    it('should generate correct grid template with flexible columns (no maxWidth)', () => {
      const columnWidths = [{ min: 100 }, { min: 200 }, { min: 150 }];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 1fr) minmax(200px, 1fr) minmax(150px, 1fr)');
      expect(result.totalMinWidth).toBe(450);
    });

    it('should handle columns with maxWidth (capped columns)', () => {
      const columnWidths = [{ min: 100, max: 100 }, { min: 200 }, { min: 150, max: 250 }];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 100px) minmax(200px, 1fr) minmax(150px, 250px)');
      expect(result.totalMinWidth).toBe(450);
    });

    it('should handle all columns with maxWidth (all fixed)', () => {
      const columnWidths = [
        { min: 100, max: 100 },
        { min: 150, max: 150 },
        { min: 200, max: 200 },
      ];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 100px) minmax(150px, 150px) minmax(200px, 200px)');
      expect(result.totalMinWidth).toBe(450);
    });

    it('should handle single column', () => {
      const columnWidths = [{ min: 100 }];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 1fr)');
      expect(result.totalMinWidth).toBe(100);
    });

    it('should handle single column with maxWidth', () => {
      const columnWidths = [{ min: 100, max: 150 }];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 150px)');
      expect(result.totalMinWidth).toBe(100);
    });

    it('should handle empty array', () => {
      const columnWidths: Array<{ min: number; max?: number }> = [];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('');
      expect(result.totalMinWidth).toBe(0);
    });

    it('should handle mixed flexible and capped columns', () => {
      const columnWidths = [{ min: 50, max: 50 }, { min: 300 }, { min: 75, max: 100 }, { min: 125 }];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(50px, 50px) minmax(300px, 1fr) minmax(75px, 100px) minmax(125px, 1fr)');
      expect(result.totalMinWidth).toBe(550);
    });

    it('should handle string maxWidth values like max-content', () => {
      const columnWidths = [{ min: 100 }, { min: 200, max: 250 }, { min: 100, max: 'max-content' as const }];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 1fr) minmax(200px, 250px) minmax(100px, max-content)');
      expect(result.totalMinWidth).toBe(400);
    });

    it('should use measured widths for max-content columns when provided', () => {
      const columnWidths = [{ min: 100 }, { min: 200, max: 250 }, { min: 100, max: 'max-content' as const }];
      const measuredWidths = [undefined, undefined, 150];

      const result = calculateGridTemplate(columnWidths, measuredWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 1fr) minmax(200px, 250px) minmax(100px, 150px)');
      expect(result.totalMinWidth).toBe(400);
    });

    it('should fall back to max-content when no measured width is provided', () => {
      const columnWidths = [{ min: 100, max: 'max-content' as const }];
      const measuredWidths: (number | undefined)[] = [undefined];

      const result = calculateGridTemplate(columnWidths, measuredWidths);

      expect(result.gridTemplate).toBe('minmax(100px, max-content)');
    });
  });

  describe('getScrollbarWidth', () => {
    it('should calculate scrollbar width correctly', () => {
      const result = getScrollbarWidth(1000, 985);

      expect(result).toBe(15);
    });

    it('should return 0 when no scrollbar', () => {
      const result = getScrollbarWidth(1000, 1000);

      expect(result).toBe(0);
    });

    it('should handle different scrollbar widths', () => {
      const result = getScrollbarWidth(800, 783);

      expect(result).toBe(17);
    });

    it('should handle zero dimensions', () => {
      const result = getScrollbarWidth(0, 0);

      expect(result).toBe(0);
    });
  });

  describe('measureContentWidths', () => {
    it('should return undefined for columns without max-content', () => {
      const columnWidths = [{ min: 100 }, { min: 200, max: 250 }];

      const result = measureContentWidths(columnWidths, null, null, '.table-head-cell');

      expect(result).toEqual([undefined, undefined]);
    });

    it('should return measurements for max-content columns', () => {
      // Create mock DOM elements
      const headerRow = document.createElement('div');
      const headerCell = document.createElement('div');
      headerCell.className = 'table-head-cell';
      const headerContent = document.createElement('div');
      headerContent.className = 'table-header-contents-wrapper';
      Object.defineProperty(headerContent, 'scrollWidth', { value: 80 });
      headerCell.appendChild(headerContent);
      headerRow.appendChild(headerCell);

      const bodyContainer = document.createElement('div');
      const tableBody = document.createElement('div');
      tableBody.className = 'table-body';
      const bodyRow = document.createElement('div');
      bodyRow.className = 'table-row';
      const bodyCell = document.createElement('div');
      bodyCell.className = 'table-cell';
      const cellContent = document.createElement('div');
      cellContent.className = 'table-cell-content';
      Object.defineProperty(cellContent, 'scrollWidth', { value: 100 });
      bodyCell.appendChild(cellContent);
      bodyRow.appendChild(bodyCell);
      tableBody.appendChild(bodyRow);
      bodyContainer.appendChild(tableBody);

      const columnWidths = [{ min: 50, max: 'max-content' as const }];

      const result = measureContentWidths(columnWidths, headerRow, bodyContainer, '.table-head-cell');

      // Should return the max width + 20px padding
      expect(result).toEqual([120]);
    });

    it('should handle empty elements', () => {
      const columnWidths = [{ min: 100, max: 'max-content' as const }];

      const result = measureContentWidths(columnWidths, null, null, '.table-head-cell');

      // Should return 20 (just padding since no content found)
      expect(result).toEqual([20]);
    });
  });
});
