import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { type Table as TableProps, type Row } from './Table';
import './Table.scss';

export const TableFlex = ({ header, data, className, onRowClick, onHeaderCellClick, selectedRows }: TableProps) => {
  const sortedHeaderEntries = Object.entries(header).sort(
    ([_key1, value1], [_key2, value2]) => (value1?.position ?? 0) - (value2?.position ?? 0),
  );

  const tableHeadElemRef = useRef<HTMLDivElement>(null);
  const tableHeadRowElemRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerElemRef = useRef<HTMLDivElement>(null);
  const { table, tableFlex, tableHead, tableHeadCell, tableRow, tableBodyContainer, tableBody } =
    DOM_ELEMENTS.classNames;

  useEffect(() => {
    // Extract column widths from classNames
    const columnWidths = sortedHeaderEntries.map(([, config]) => {
      return config.minWidth ?? 100; // Default to 100px
    });

    const totalMinWidth = columnWidths.reduce((sum, width) => sum + width, 0);

    // Create grid template: each column can grow but not shrink below minimum
    const gridTemplate = columnWidths.map(width => `minmax(${width}px, 1fr)`).join(' ');

    // Calculate scrollbar width by comparing container dimensions
    const scrollbarWidth =
      (tableBodyContainerElemRef.current?.offsetWidth ?? 0) -
      (tableBodyContainerElemRef.current?.clientWidth ?? 0);

    // Apply to header container to account for scrollbar
    if (tableHeadElemRef.current) {
      tableHeadElemRef.current.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Apply to header row
    if (tableHeadRowElemRef.current) {
      tableHeadRowElemRef.current.style.gridTemplateColumns = gridTemplate;
      tableHeadRowElemRef.current.style.minWidth = `${totalMinWidth}px`;
    }

    // Apply to body rows
    const bodyRows = tableBodyContainerElemRef.current?.querySelectorAll('.table-body > .table-row');
    bodyRows?.forEach(row => {
      (row as HTMLElement).style.gridTemplateColumns = gridTemplate;
      (row as HTMLElement).style.minWidth = `${totalMinWidth}px`;
    });

    // Scroll sync
    const handleScroll = (event: Event) => {
      const { target } = event;
      if (!target) return;

      const { scrollLeft } = target as HTMLElement;
      requestAnimationFrame(() => {
        tableHeadElemRef?.current?.scrollTo({ left: scrollLeft });
      });
    };

    tableBodyContainerElemRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      tableBodyContainerElemRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [sortedHeaderEntries, data]);

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
          {sortedHeaderEntries.map(([key, { label, className, ...rest }]) => (
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
          ))}
        </div>
      </div>
      <div ref={tableBodyContainerElemRef} className={tableBodyContainer}>
        <div className={tableBody}>
          {data.map((row: Row) => {
            const rowMeta = row.__meta as Record<string, any>;

            return (
              <div
                data-testid="table-row"
                key={rowMeta?.key || rowMeta?.id}
                role="row"
                tabIndex={0}
                className={classNames(
                  tableRow,
                  { clickable: onRowClick, 'row-selected': selectedRows?.includes(rowMeta?.id) },
                  rowMeta?.className,
                )}
                onClick={() => onRowClick?.(row)}
                onKeyDown={event => handleRowKeyDown(event, row)}
              >
                {sortedHeaderEntries.map(([key, { className: headerClassName }]) => {
                  const { label, children, className, ...rest } = row?.[key] || {};

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
