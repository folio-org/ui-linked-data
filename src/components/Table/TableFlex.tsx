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
    const tableHeadElemWidth = tableHeadRowElemRef.current?.getBoundingClientRect()?.width;
    const maxScrollbarWidth = 30;

    if (tableHeadElemWidth && maxScrollbarWidth) {
      tableHeadRowElemRef.current?.setAttribute('style', `width: ${tableHeadElemWidth + maxScrollbarWidth}px`);
    }

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
  }, []);

  return (
    <div data-testid="table" className={classNames(table, tableFlex, className)}>
      <div ref={tableHeadElemRef} className={tableHead}>
        <div ref={tableHeadRowElemRef} className={tableRow}>
          {sortedHeaderEntries.map(([key, { label, className, ...rest }]) => (
            <div
              key={key}
              data-testid={`th-${key}`}
              className={classNames(tableHeadCell, { clickable: onHeaderCellClick }, className)}
              onClick={() => onHeaderCellClick?.({ [key]: header[key] })}
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
                className={classNames(
                  tableRow,
                  { clickable: onRowClick, 'row-selected': selectedRows?.includes(rowMeta?.id) },
                  rowMeta?.className,
                )}
                onClick={() => onRowClick?.(row)}
              >
                {sortedHeaderEntries.map(([key, { className: headerClassName }]) => {
                  const { label, children, className, ...rest } = row?.[key] || {};

                  return (
                    <div
                      className={classNames('table-cell', className, headerClassName)}
                      data-testid={key}
                      key={key}
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
