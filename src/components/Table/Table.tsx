import type { JSX } from 'react';
import classNames from 'classnames';
import './Table.scss';

export type Cell = {
  label?: string | JSX.Element;
  children?: JSX.Element;
  className?: string;
  position?: number;
  [x: string]: any;
};

export type Row = Record<string, Cell>;

export type Table = {
  header: Row;
  data: Row[];
  className?: string;
  onRowClick?: (r: Row) => void;
  onHeaderCellClick?: (c: Record<string, Cell>) => void;
  selectedRows?: string[];
};

export const Table = ({ header, data, className, onRowClick, onHeaderCellClick, selectedRows }: Table) => {
  const sortedHeaderEntries = Object.entries(header).toSorted(
    ([_key1, value1], [_key2, value2]) => (value1?.position ?? 0) - (value2?.position ?? 0),
  );

  return (
    <table data-testid="table" className={classNames('table', className)}>
      <thead>
        <tr>
          {sortedHeaderEntries.map(([key, { label, className, ...rest }]) => (
            <th
              key={key}
              data-testid={`th-${key}`}
              className={classNames({ clickable: onHeaderCellClick }, className)}
              onClick={() => onHeaderCellClick?.({ [key]: header[key] })}
              {...rest}
            >
              <div className="table-header-contents-wrapper">{label ?? ''}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: Row) => {
          const rowMeta = row.__meta as Record<string, any>;

          return (
            <tr
              data-testid="table-row"
              key={rowMeta?.key || rowMeta?.id}
              className={classNames(
                { clickable: onRowClick, 'row-selected': selectedRows?.includes(rowMeta?.id) },
                rowMeta?.className,
              )}
              onClick={() => onRowClick?.(row)}
            >
              {sortedHeaderEntries.map(([key]) => {
                const { label, children, className, ...rest } = row?.[key] || {};

                return (
                  <td className={classNames(className)} data-testid={key} key={key} {...rest}>
                    {(children || label) ?? ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
