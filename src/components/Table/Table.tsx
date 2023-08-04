import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import './Table.scss';

export type Cell = {
  label?: string;
  children?: JSX.Element;
};

export type Row = Record<string, Cell | Record<string, any>>;

export type Table = {
  header: Row;
  data: Row[];
  className?: string;
  onRowClick?: (r: Row) => void;
  onHeaderCellClick?: (c: Record<string, Cell>) => void;
};

export const Table = ({ header, data, className, onRowClick, onHeaderCellClick }: Table) => {
  return (
    <table data-testid='table' className={classNames('table', className)}>
      <thead>
        <tr>
          {Object.entries(header).map(([key, { label }]) => (
            <th
              key={key}
              className={classNames({ clickable: onHeaderCellClick })}
              onClick={() => onHeaderCellClick?.({ [key]: header[key] })}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: Row) => (
          <tr
            key={(row.__meta as Record<string, any>)?.id || uuidv4()}
            className={classNames({ clickable: onRowClick })}
            onClick={() => onRowClick?.(row)}
          >
            {Object.keys(header).map(key => {
              const { label, children } = row?.[key] || {};

              return <td data-testid={key} key={key}>{(label || children) ?? ''}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
