import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import {
  calculateGridTemplate,
  extractColumnWidths,
  getScrollbarWidth,
  measureContentWidths,
} from '@common/helpers/table.helpers';
import { type Table as TableProps, type Row, type Cell } from './Table';
import './Table.scss';

export const TableFlex = ({ header, data, className, onRowClick, onHeaderCellClick, selectedRows }: TableProps) => {
  const sortedHeaderEntries = useMemo(
    () =>
      Object.entries(header).sort(
        ([_key1, value1], [_key2, value2]) => ((value1 as Cell)?.position ?? 0) - ((value2 as Cell)?.position ?? 0),
      ),
    [header],
  );

  const tableHeadElemRef = useRef<HTMLDivElement>(null);
  const tableHeadRowElemRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerElemRef = useRef<HTMLDivElement>(null);
  const [measuredWidths, setMeasuredWidths] = useState<(number | undefined)[]>([]);
  const { table, tableFlex, tableHead, tableHeadCell, tableRow, tableBodyContainer, tableBody } =
    DOM_ELEMENTS.classNames;

  // Check if any column needs content-based measurement
  const hasContentFitColumns = useMemo(
    () => sortedHeaderEntries.some(([, config]) => (config as Cell).maxWidth === 'max-content'),
    [sortedHeaderEntries],
  );

  // Phase 1: Initial render with temporary widths, then measure content
  useLayoutEffect(() => {
    if (!hasContentFitColumns) return;

    const columnWidths = extractColumnWidths(sortedHeaderEntries);
    const measured = measureContentWidths(
      columnWidths,
      tableHeadRowElemRef.current,
      tableBodyContainerElemRef.current,
      `.${tableHeadCell}`,
    );

    // Only update if measurements changed
    const hasChanges = measured.some((w, i) => w !== measuredWidths[i]);
    if (hasChanges) {
      setMeasuredWidths(measured);
    }
  }, [sortedHeaderEntries, data, hasContentFitColumns, measuredWidths]);

  // Phase 2: Apply grid layout and styles synchronously before paint
  useLayoutEffect(() => {
    const applyHeaderStyles = (scrollbarWidth: number, gridTemplate: string, totalMinWidth: number) => {
      if (tableHeadElemRef.current) {
        tableHeadElemRef.current.style.paddingRight = `${scrollbarWidth}px`;
      }

      if (tableHeadRowElemRef.current) {
        tableHeadRowElemRef.current.style.gridTemplateColumns = gridTemplate;
        tableHeadRowElemRef.current.style.minWidth = `${totalMinWidth}px`;
      }
    };

    const applyBodyRowStyles = (gridTemplate: string, totalMinWidth: number) => {
      const bodyRows = tableBodyContainerElemRef.current?.querySelectorAll(`.${tableBody} > .${tableRow}`);

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
      tableBodyContainerElemRef.current?.offsetWidth ?? 0,
      tableBodyContainerElemRef.current?.clientWidth ?? 0,
    );

    applyHeaderStyles(scrollbarWidth, gridTemplate, totalMinWidth);
    applyBodyRowStyles(gridTemplate, totalMinWidth);
  }, [sortedHeaderEntries, data, measuredWidths, hasContentFitColumns]);

  useEffect(() => {
    const syncHorizontalScroll = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const { scrollLeft } = target;

      requestAnimationFrame(() => {
        tableHeadElemRef.current?.scrollTo({ left: scrollLeft });
      });
    };

    const bodyContainer = tableBodyContainerElemRef.current;
    bodyContainer?.addEventListener('scroll', syncHorizontalScroll);

    return () => {
      bodyContainer?.removeEventListener('scroll', syncHorizontalScroll);
    };
  }, []);

  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, key: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      onHeaderCellClick?.({ [key]: header[key] });
    }
  };

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, row: Row) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      onRowClick?.(row);
    }
  };

  return (
    <div role="table" data-testid="table" className={classNames(table, tableFlex, className)}>
      <div role="rowgroup" ref={tableHeadElemRef} className={tableHead}>
        <div role="row" ref={tableHeadRowElemRef} className={tableRow}>
          {sortedHeaderEntries.map(([key, value]) => {
            const { label, className, minWidth: _minWidth, maxWidth: _maxWidth, ...rest } = value as Cell; // eslint-disable-line @typescript-eslint/no-unused-vars -- Intentionally excluded from rest spread
            return (
              <div
                key={key}
                data-testid={`th-${key}`}
                role="columnheader"
                tabIndex={0}
                className={classNames(tableHeadCell, { clickable: onHeaderCellClick }, className)}
                onClick={() => onHeaderCellClick?.({ [key]: header[key] })}
                onKeyDown={event => handleHeaderKeyDown(event, key)}
                {...rest}
              >
                <div className="table-header-contents-wrapper">{label ?? ''}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div ref={tableBodyContainerElemRef} className={tableBodyContainer}>
        <div className={tableBody}>
          {data.map((row: Row) => {
            const rowMeta = row.__meta;

            return (
              <div
                data-testid="table-row"
                key={rowMeta?.key || rowMeta?.id}
                role="row"
                tabIndex={0}
                className={classNames(
                  tableRow,
                  { clickable: onRowClick, 'row-selected': rowMeta?.id && selectedRows?.includes(rowMeta.id) },
                  rowMeta?.className,
                )}
                onClick={() => onRowClick?.(row)}
                onKeyDown={event => handleRowKeyDown(event, row)}
              >
                {sortedHeaderEntries.map(([key, { className: headerClassName }]) => {
                  const {
                    label,
                    children,
                    className,
                    minWidth: _cellMinWidth, // eslint-disable-line @typescript-eslint/no-unused-vars -- Intentionally excluded from rest spread
                    maxWidth: _cellMaxWidth, // eslint-disable-line @typescript-eslint/no-unused-vars -- Intentionally excluded from rest spread
                    ...rest
                  } = row?.[key] || {};

                  return (
                    <div
                      className={classNames('table-cell', className, headerClassName)}
                      data-testid={key}
                      key={key}
                      role="cell"
                      {...rest}
                    >
                      <div className="table-cell-content">{(children || label) ?? ''}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
