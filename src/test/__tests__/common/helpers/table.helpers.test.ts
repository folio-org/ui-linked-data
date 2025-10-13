import { calculateGridTemplate, extractColumnWidths, getScrollbarWidth } from '@common/helpers/table.helpers';

describe('table.helpers', () => {
  describe('extractColumnWidths', () => {
    it('should extract minWidth values from header entries', () => {
      const headerEntries: [string, { minWidth?: number }][] = [
        ['col1', { minWidth: 100 }],
        ['col2', { minWidth: 200 }],
        ['col3', { minWidth: 150 }],
      ];

      const result = extractColumnWidths(headerEntries);

      expect(result).toEqual([100, 200, 150]);
    });

    it('should use default width when minWidth is not specified', () => {
      const headerEntries: [string, { minWidth?: number }][] = [
        ['col1', { minWidth: 100 }],
        ['col2', {}],
        ['col3', { minWidth: 150 }],
      ];

      const result = extractColumnWidths(headerEntries);

      expect(result).toEqual([100, 100, 150]);
    });

    it('should use custom default width', () => {
      const headerEntries: [string, { minWidth?: number }][] = [
        ['col1', {}],
        ['col2', {}],
      ];

      const result = extractColumnWidths(headerEntries, 200);

      expect(result).toEqual([200, 200]);
    });

    it('should handle empty array', () => {
      const result = extractColumnWidths([]);

      expect(result).toEqual([]);
    });
  });

  describe('calculateGridTemplate', () => {
    it('should generate correct grid template and total width', () => {
      const columnWidths = [100, 200, 150];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 1fr) minmax(200px, 1fr) minmax(150px, 1fr)');
      expect(result.totalMinWidth).toBe(450);
    });

    it('should handle single column', () => {
      const columnWidths = [100];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(100px, 1fr)');
      expect(result.totalMinWidth).toBe(100);
    });

    it('should handle empty array', () => {
      const columnWidths: number[] = [];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('');
      expect(result.totalMinWidth).toBe(0);
    });

    it('should handle various column widths', () => {
      const columnWidths = [50, 300, 75, 125];

      const result = calculateGridTemplate(columnWidths);

      expect(result.gridTemplate).toBe('minmax(50px, 1fr) minmax(300px, 1fr) minmax(75px, 1fr) minmax(125px, 1fr)');
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
