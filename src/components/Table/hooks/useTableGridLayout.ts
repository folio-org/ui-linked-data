import { type RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import {
  calculateGridTemplate,
  extractColumnWidths,
  getScrollbarWidth,
  measureContentWidths,
} from '@/common/helpers/table.helpers';

import { type Cell } from '../Table';

type HeaderEntry = [string, Cell];

interface TableRefs {
  tableHeadRef: RefObject<HTMLDivElement | null>;
  tableHeadRowRef: RefObject<HTMLDivElement | null>;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}

interface UseTableGridLayoutProps {
  sortedHeaderEntries: HeaderEntry[];
  refs: TableRefs;
  dataLength: number;
}

/**
 * Hook for managing CSS Grid layout in TableFlex component
 * Handles content-based column width measurement and grid template application
 */
export const useTableGridLayout = ({ sortedHeaderEntries, refs, dataLength }: UseTableGridLayoutProps) => {
  const { tableHeadRef, tableHeadRowRef, tableBodyContainerRef } = refs;
  const [measuredWidths, setMeasuredWidths] = useState<(number | undefined)[]>([]);
  const prevMeasurementsRef = useRef<string>('');

  const { tableBody, tableRow, tableHeadCell } = DOM_ELEMENTS.classNames;

  // Check if any column needs content-based measurement
  const hasContentFitColumns = useMemo(
    () => sortedHeaderEntries.some(([, config]) => config.maxWidth === 'max-content'),
    [sortedHeaderEntries],
  );

  // Phase 1: Initial render with temporary widths, then measure content
  useLayoutEffect(() => {
    if (!hasContentFitColumns) return;

    const currentDataKey = `${dataLength}-${sortedHeaderEntries.map(([entry]) => entry).join(',')}`;

    // Only measure if data changed or never measured
    if (currentDataKey === prevMeasurementsRef.current) {
      return;
    }

    const columnWidths = extractColumnWidths(sortedHeaderEntries);
    const measured = measureContentWidths(
      columnWidths,
      tableHeadRowRef.current,
      tableBodyContainerRef.current,
      `.${tableHeadCell}`,
    );

    prevMeasurementsRef.current = currentDataKey;
    setMeasuredWidths(measured);
  }, [sortedHeaderEntries, dataLength, hasContentFitColumns, tableHeadRowRef, tableBodyContainerRef, tableHeadCell]);

  // Phase 2: Apply grid layout and styles synchronously before paint
  useLayoutEffect(() => {
    const applyHeaderStyles = (scrollbarWidth: number, gridTemplate: string, totalMinWidth: number) => {
      if (tableHeadRef.current) {
        tableHeadRef.current.style.paddingRight = `${scrollbarWidth}px`;
      }

      if (tableHeadRowRef.current) {
        tableHeadRowRef.current.style.gridTemplateColumns = gridTemplate;
        tableHeadRowRef.current.style.minWidth = `${totalMinWidth}px`;
      }
    };

    const applyBodyRowStyles = (gridTemplate: string, totalMinWidth: number) => {
      const bodyRows = tableBodyContainerRef.current?.querySelectorAll(`.${tableBody} > .${tableRow}`);

      bodyRows?.forEach(row => {
        (row as HTMLElement).style.gridTemplateColumns = gridTemplate;
        (row as HTMLElement).style.minWidth = `${totalMinWidth}px`;
      });
    };

    const columnWidths = extractColumnWidths(sortedHeaderEntries);
    const { gridTemplate, totalMinWidth } = calculateGridTemplate(
      columnWidths,
      hasContentFitColumns ? measuredWidths : undefined,
    );
    const scrollbarWidth = getScrollbarWidth(
      tableBodyContainerRef.current?.offsetWidth ?? 0,
      tableBodyContainerRef.current?.clientWidth ?? 0,
    );

    applyHeaderStyles(scrollbarWidth, gridTemplate, totalMinWidth);
    applyBodyRowStyles(gridTemplate, totalMinWidth);
  }, [
    sortedHeaderEntries,
    dataLength,
    measuredWidths,
    hasContentFitColumns,
    tableHeadRef,
    tableHeadRowRef,
    tableBodyContainerRef,
    tableBody,
    tableRow,
  ]);

  return { hasContentFitColumns, measuredWidths };
};
