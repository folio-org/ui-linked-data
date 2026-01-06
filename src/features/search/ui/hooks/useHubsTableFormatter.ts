import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { type Row } from '@/components/Table';
import { useFormattedResults } from './useFormattedResults';
import { useEnrichHubsWithLocalCheck } from './useEnrichHubsWithLocalCheck';
import { hubsTableConfig } from '../config/results/hubsTable.config';

interface UseHubsTableFormatterProps {
  onEdit?: (id: string) => void;
  onImport?: (id: string, uri: string) => void;
}

export interface UseHubsTableFormatterReturn {
  formattedData: Row[];
  listHeader: Row;
}

/**
 * Еable formatter hook for Hub Search Results
 */
export function useHubsTableFormatter({ onEdit, onImport }: UseHubsTableFormatterProps): UseHubsTableFormatterReturn {
  const { formatMessage } = useIntl();

  const rawData = useFormattedResults<SearchResultsTableRow>();
  const enrichedData = useEnrichHubsWithLocalCheck(rawData);

  const applyFormatters = useCallback(
    (rows: SearchResultsTableRow[]): Row[] => {
      return rows.map(row => {
        const formattedRow: Row = { ...row };

        // Apply formatter for each column in the config
        Object.entries(hubsTableConfig.columns).forEach(([key, column]) => {
          formattedRow[key] = {
            ...row[key],
            children: column.formatter
              ? column.formatter({
                  row,
                  formatMessage,
                  onEdit,
                  onImport,
                })
              : row[key]?.label,
          };
        });

        return formattedRow;
      });
    },
    [formatMessage, onEdit, onImport],
  );

  const formattedData = useMemo(() => applyFormatters(enrichedData || []), [applyFormatters, enrichedData]);

  const listHeader = useMemo(
    () =>
      Object.keys(hubsTableConfig.columns).reduce((accum, key) => {
        const { label, position, className, minWidth, maxWidth } = hubsTableConfig.columns[
          key
        ] as SearchResultsTableColumn;

        accum[key] = {
          label: label ? formatMessage({ id: label }) : '',
          position,
          className,
          minWidth,
          maxWidth,
        };

        return accum;
      }, {} as Row),
    [formatMessage],
  );

  return {
    formattedData,
    listHeader,
  };
}
