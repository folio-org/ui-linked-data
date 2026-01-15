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
 * Measures an element's width.
 * Temporarily sets width to max-content, measures, and restores original styles.
 */
const measureElementWidth = (element: HTMLElement): number => {
  const savedCssText = element.style.cssText;

  element.style.width = 'max-content';
  element.style.minWidth = '0';
  element.style.maxWidth = 'none';

  const width = element.getBoundingClientRect().width;

  element.style.cssText = savedCssText;

  return width;
};

/**
 * Measures the actual content width of specified columns
 * Returns an array of widths for columns that need content-based sizing
 */

const RESULTS_SAMPLE_COUNT = 50;
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

    // Measure header cell content
    const headerCells = headerRowElement?.querySelectorAll(cellSelector);
    const headerWrapper = headerCells?.[index]?.querySelector('.table-header-contents-wrapper') as HTMLElement | null;

    if (headerWrapper) {
      maxWidth = Math.max(maxWidth, measureElementWidth(headerWrapper));
    }

    // Measure body cells - sample first rows for performance
    const bodyRows = bodyContainerElement?.querySelectorAll('.table-body > .table-row');
    const sampleSize = Math.min(bodyRows?.length ?? 0, RESULTS_SAMPLE_COUNT);

    for (let i = 0; i < sampleSize; i++) {
      const row = bodyRows?.[i];
      const cells = row?.querySelectorAll('.table-cell');
      const content = cells?.[index]?.querySelector('.table-cell-content') as HTMLElement | null;

      if (content?.firstElementChild) {
        maxWidth = Math.max(maxWidth, measureElementWidth(content.firstElementChild as HTMLElement));
      }
    }

    // Add padding for cell content (10px on each side)
    return maxWidth + 20;
  });
};
