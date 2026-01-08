import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { type Row } from '@/components/Table';
import { logger } from '@/common/services/logger';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { useStatusState } from '@/store';
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
  isLoading: boolean;
}

/**
 * Table formatter hook for Hub Search Results
 */
export function useHubsTableFormatter({ onEdit, onImport }: UseHubsTableFormatterProps): UseHubsTableFormatterReturn {
  const { formatMessage } = useIntl();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const rawData = useFormattedResults<SearchResultsTableRow>();
  const { enrichedData, error, isLoading } = useEnrichHubsWithLocalCheck(rawData);

  // Handle errors from hub enrichment
  useEffect(() => {
    if (error) {
      logger.error('Error checking local hub availability:', error);
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    }
  }, [error, addStatusMessagesItem]);

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
