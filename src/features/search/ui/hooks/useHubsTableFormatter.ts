import { useIntl } from 'react-intl';
import { type Row } from '@/components/Table';
import { useFormattedResults } from './useFormattedResults';
import { useEnrichHubsWithLocalCheck } from './useEnrichHubsWithLocalCheck';
import { hubsTableConfig } from '../config/results/hubsTable.config';
import { applyColumnFormatters, buildTableHeader } from '../utils/tableFormatters.util';

interface UseHubsTableFormatterProps {
  onEdit?: (id: string) => void;
  onImport?: (id: string, uri: string) => void;
}

export interface UseHubsTableFormatterReturn {
  formattedData: Row[];
  listHeader: Row;
}

/**
 * Table formatter hook for Hub Search Results
 */
export function useHubsTableFormatter({ onEdit, onImport }: UseHubsTableFormatterProps): UseHubsTableFormatterReturn {
  const { formatMessage } = useIntl();

  const rawData = useFormattedResults<SearchResultsTableRow>();
  const enrichedData = useEnrichHubsWithLocalCheck(rawData);

  const applyFormatters = (rows: SearchResultsTableRow[]): Row[] => {
    return applyColumnFormatters(rows, hubsTableConfig.columns, { formatMessage, onEdit, onImport });
  };

  const formattedData = applyFormatters(enrichedData || []);

  const listHeader = buildTableHeader(hubsTableConfig.columns, formatMessage);

  return {
    formattedData,
    listHeader,
  };
}
