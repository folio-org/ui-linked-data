import { memo, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';

import { type Cell, type Row, type Table as TableProps } from './Table';
import { useTableGridLayout } from './hooks/useTableGridLayout';

import './Table.scss';

export const TableFlex = memo(
  ({ header, data, className, onRowClick, onHeaderCellClick, selectedRows }: TableProps) => {
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

    const { table, tableFlex, tableHead, tableHeadCell, tableRow, tableBodyContainer, tableBody } =
      DOM_ELEMENTS.classNames;

    // Use the grid layout hook for column width calculation and style application
    useTableGridLayout({
      sortedHeaderEntries,
      refs: {
        tableHeadRef: tableHeadElemRef,
        tableHeadRowRef: tableHeadRowElemRef,
        tableBodyContainerRef: tableBodyContainerElemRef,
      },
      dataLength: data.length,
    });

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
  },
);
