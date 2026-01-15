type HeaderEntry = [string, { minWidth?: number; maxWidth?: number | string; [key: string]: unknown }];

type ColumnWidthConfig = { min: number; max?: number | string };

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
 * // Content-fit column: minmax(100px, max-content) - fits to content width
 */
export const calculateGridTemplate = (
  columnWidths: ColumnWidthConfig[],
  measuredContentWidths?: (number | undefined)[],
) => {
  const totalMinWidth = columnWidths.reduce((sum, { min }) => sum + min, 0);

  const gridTemplate = columnWidths
    .map(({ min, max }, index) => {
      let maxValue = '1fr';

      if (max === 'max-content' && measuredContentWidths?.[index] !== undefined) {
        maxValue = `${measuredContentWidths[index]}px`;
      } else if (max !== undefined) {
        maxValue = typeof max === 'number' ? `${max}px` : max;
      }

      return `minmax(${min}px, ${maxValue})`;
    })
    .join(' ');

  return { gridTemplate, totalMinWidth };
};

export const getScrollbarWidth = (offsetWidth: number, clientWidth: number): number => {
  return offsetWidth - clientWidth;
};

/**
 * Measures the actual content width of specified columns
 * Returns an array of widths for columns that need content-based sizing
 */
export const measureContentWidths = (
  columnWidths: ColumnWidthConfig[],
  headerRowElement: HTMLElement | null,
  bodyContainerElement: HTMLElement | null,
  cellSelector: string,
): (number | undefined)[] => {
  return columnWidths.map((config, index) => {
    // Only measure columns that specify max-content
    if (config.max !== 'max-content') {
      return undefined;
    }

    let maxWidth = 0;

    // Measure header cell
    const headerCells = headerRowElement?.querySelectorAll(cellSelector);
    if (headerCells?.[index]) {
      const contentWrapper = headerCells[index].querySelector('.table-header-contents-wrapper');
      const width = contentWrapper?.scrollWidth ?? (headerCells[index] as HTMLElement).scrollWidth;
      maxWidth = Math.max(maxWidth, width);
    }

    // Measure all body cells in this column
    const bodyRows = bodyContainerElement?.querySelectorAll('.table-body > .table-row');
    bodyRows?.forEach(row => {
      const cells = row.querySelectorAll('.table-cell');
      if (cells[index]) {
        const contentWrapper = cells[index].querySelector('.table-cell-content');
        const width = contentWrapper?.scrollWidth ?? (cells[index] as HTMLElement).scrollWidth;
        maxWidth = Math.max(maxWidth, width);
      }
    });

    // Add padding for cell content
    return maxWidth + 20; // 10px padding on each side
  });
};
