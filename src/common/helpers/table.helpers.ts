type HeaderEntry = [string, { minWidth?: number; maxWidth?: number; [key: string]: unknown }];

type ColumnWidthConfig = { min: number; max?: number };

export const extractColumnWidths = (headerEntries: HeaderEntry[], defaultMinWidth = 100): ColumnWidthConfig[] => {
  return headerEntries.map(([, config]) => ({
    min: config.minWidth ?? defaultMinWidth,
    max: config.maxWidth,
  }));
};

/**
 * Calculates CSS Grid template and total minimum width from column width configurations
 * Supports columns with maximum widths (capped) and flexible columns (1fr)
 * @example
 * // Flexible column: minmax(100px, 1fr) - grows to fill space
 * // Fixed column: minmax(100px, 100px) - stays at fixed width
 * // Capped column: minmax(100px, 250px) - grows up to max
 */
export const calculateGridTemplate = (columnWidths: ColumnWidthConfig[]) => {
  const totalMinWidth = columnWidths.reduce((sum, { min }) => sum + min, 0);

  const gridTemplate = columnWidths
    .map(({ min, max }) => {
      const maxValue = max !== undefined ? `${max}px` : '1fr';

      return `minmax(${min}px, ${maxValue})`;
    })
    .join(' ');

  return { gridTemplate, totalMinWidth };
};

export const getScrollbarWidth = (offsetWidth: number, clientWidth: number): number => {
  return offsetWidth - clientWidth;
};
