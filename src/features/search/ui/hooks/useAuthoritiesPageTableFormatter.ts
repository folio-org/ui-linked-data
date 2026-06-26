import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { type Row } from '@/components/Table';

import { authoritiesPageTableConfig } from '../config/results/authoritiesPageTable.config';
import { marigoldAuthoritiesPageTableConfig } from '../config/results/marigoldAuthoritiesPageTable.config';
import { useSearchContext } from '../providers/SearchProvider';
import { applyColumnFormatters, buildTableHeader } from '../utils/tableFormatters.util';
import { useFormattedResults } from './useFormattedResults';

const LD_AUTHORITY_CONFIG_IDS = new Set(['authorities', 'authorities:ld']);

interface UseAuthoritiesPageTableFormatterProps {
  onEdit?: (id: string) => void;
  onImport?: (id: string) => void;
}

export interface UseAuthoritiesPageTableFormatterReturn {
  formattedData: Row[];
  listHeader: Row;
}

export function useAuthoritiesPageTableFormatter({
  onEdit,
  onImport,
}: UseAuthoritiesPageTableFormatterProps): UseAuthoritiesPageTableFormatterReturn {
  const { formatMessage } = useIntl();
  const { activeCoreConfig } = useSearchContext();
  const formatterOptions = useMemo(
    () => ({ notSpecifiedLabel: formatMessage({ id: 'ld.notSpecified' }) }),
    [formatMessage],
  );
  const formattedResults = useFormattedResults<SearchResultsTableRow>(formatterOptions);

  const tableConfig = LD_AUTHORITY_CONFIG_IDS.has(activeCoreConfig?.id ?? '')
    ? marigoldAuthoritiesPageTableConfig
    : authoritiesPageTableConfig;

  const formattedData = useMemo(() => {
    if (!formattedResults) return [];

    return applyColumnFormatters(formattedResults, tableConfig.columns, {
      formatMessage,
      onEdit,
      onImport,
    });
  }, [formattedResults, tableConfig, formatMessage, onEdit, onImport]);

  const listHeader = useMemo(() => {
    return buildTableHeader(tableConfig.columns, formatMessage);
  }, [tableConfig, formatMessage]);

  return { formattedData, listHeader };
}
