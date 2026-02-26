import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { type Row } from '@/components/Table';

import { hubsTableConfig } from '../config/results/hubsTable.config';
import { applyColumnFormatters, buildTableHeader } from '../utils/tableFormatters.util';
import { useFormattedResults } from './useFormattedResults';

interface UseHubsTableFormatterProps {
  onEdit?: (id: string) => void;
  onImport?: (uri: string) => void;
  onTitleClick?: (id: string) => void;
}

export interface UseHubsTableFormatterReturn {
  formattedData: Row[];
  listHeader: Row;
}

/**
 * Table formatter hook for Hub Search Results
 */
export function useHubsTableFormatter({
  onEdit,
  onImport,
  onTitleClick,
}: UseHubsTableFormatterProps): UseHubsTableFormatterReturn {
  const { formatMessage } = useIntl();
  const formattedResults = useFormattedResults<SearchResultsTableRow>();

  const formattedData = useMemo(() => {
    if (!formattedResults) return [];

    return applyColumnFormatters(formattedResults, hubsTableConfig.columns, {
      formatMessage,
      onEdit,
      onImport,
      onTitleClick,
    });
  }, [formattedResults, formatMessage, onEdit, onImport, onTitleClick]);

  const listHeader = useMemo(() => {
    return buildTableHeader(hubsTableConfig.columns, formatMessage);
  }, [formatMessage]);

  return {
    formattedData,
    listHeader,
  };
}
