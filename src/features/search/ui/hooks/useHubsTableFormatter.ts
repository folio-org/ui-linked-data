import { useIntl } from 'react-intl';
import { type Row } from '@/components/Table';
import { useSearchContext } from '../providers/SearchProvider';
import { useFormattedResults } from './useFormattedResults';
import { hubsTableConfig } from '../config/results/hubsTable.config';
import { applyColumnFormatters, buildTableHeader } from '../utils/tableFormatters.util';

interface UseHubsTableFormatterProps {
  onEdit?: (id: string) => void;
  onImport?: (id: string, uri: string) => void;
}

export interface UseHubsTableFormatterReturn {
  formattedData: Row[];
  listHeader: Row;
  isLoading: boolean;
}

/**
 * Table formatter hook for Hub Search Results
 */
export function useHubsTableFormatter({ onEdit, onImport }: UseHubsTableFormatterProps): UseHubsTableFormatterReturn {
  const { formatMessage } = useIntl();
  const { isLoading } = useSearchContext();
  const enrichedData = useFormattedResults<SearchResultsTableRow>();

  const applyFormatters = (rows: SearchResultsTableRow[]): Row[] => {
    return applyColumnFormatters(rows, hubsTableConfig.columns, { formatMessage, onEdit, onImport });
  };

  const formattedData = applyFormatters(enrichedData || []);
  const listHeader = buildTableHeader(hubsTableConfig.columns, formatMessage);

  return {
    formattedData,
    listHeader,
    isLoading,
  };
}
