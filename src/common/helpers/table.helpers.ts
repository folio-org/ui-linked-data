type HeaderEntry = [string, { minWidth?: number; [key: string]: unknown }];

/**
 * Extracts minimum column widths from table header configuration
 * @param headerEntries - Sorted array of [key, config] tuples from table header
 * @param defaultWidth - Default width if not specified (default: 100)
 * @returns Array of column widths in pixels
 */
export const extractColumnWidths = (headerEntries: HeaderEntry[], defaultWidth = 100): number[] => {
  return headerEntries.map(([, config]) => config.minWidth ?? defaultWidth);
};

/**
 * Calculates CSS Grid template and total minimum width from column widths
 * @param columnWidths - Array of minimum column widths in pixels
 * @returns Object containing gridTemplate string and totalMinWidth
 */
export const calculateGridTemplate = (columnWidths: number[]) => {
  const totalMinWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  const gridTemplate = columnWidths.map(width => `minmax(${width}px, 1fr)`).join(' ');

  return { gridTemplate, totalMinWidth };
};

/**
 * Calculates scrollbar width from container element dimensions
 * @param offsetWidth - Container's offsetWidth (includes scrollbar)
 * @param clientWidth - Container's clientWidth (excludes scrollbar)
 * @returns Scrollbar width in pixels
 */
export const getScrollbarWidth = (offsetWidth: number, clientWidth: number): number => {
  return offsetWidth - clientWidth;
};
