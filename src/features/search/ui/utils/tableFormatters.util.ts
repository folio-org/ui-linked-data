import { type IntlShape } from 'react-intl';
import { type Row, type Cell } from '@/components/Table';

export function applyColumnFormatters(
  rows: SearchResultsTableRow[],
  columns: Record<string, SearchResultsTableColumn>,
  context: Record<string, unknown>,
): Row[] {
  return rows.map(row => {
    const formattedRow: Row = { __meta: row.__meta };

    Object.entries(columns).forEach(([key, column]) => {
      const baseCell = row[key];
      const children = column.formatter ? column.formatter({ row, ...context }) : baseCell?.label;

      formattedRow[key] = {
        ...baseCell,
        children,
      } as Cell;
    });

    return formattedRow;
  });
}

export function buildTableHeader(
  columns: Record<string, SearchResultsTableColumn>,
  formatMessage: IntlShape['formatMessage'],
): Row {
  const header: Row = {};

  Object.keys(columns).forEach(key => {
    const column = columns[key];

    header[key] = {
      label: column.label ? formatMessage({ id: column.label }) : '',
      position: column.position,
      className: column.className,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
    };
  });

  return header;
}

export function extractRowIds(data: SearchResultsTableRow[] | undefined): string[] {
  if (!data || data.length === 0) return [];

  return data.map(row => row.__meta?.id).filter(Boolean) as string[];
}
