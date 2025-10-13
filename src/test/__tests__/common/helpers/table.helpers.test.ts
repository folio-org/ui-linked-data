import { calculateGridTemplate, extractColumnWidths, getScrollbarWidth } from '@common/helpers/table.helpers';

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
});
