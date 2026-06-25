import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { type Row } from '@/components/Table';

import { authoritiesPageTableConfig } from '../config/results/authoritiesPageTable.config';
import { applyColumnFormatters, buildTableHeader } from '../utils/tableFormatters.util';
import { useFormattedResults } from './useFormattedResults';

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
  const formatterOptions = useMemo(
    () => ({ notSpecifiedLabel: formatMessage({ id: 'ld.notSpecified' }) }),
    [formatMessage],
  );
  const formattedResults = useFormattedResults<SearchResultsTableRow>(formatterOptions);

  const formattedData = useMemo(() => {
    if (!formattedResults) return [];

    return applyColumnFormatters(formattedResults, authoritiesPageTableConfig.columns, {
      formatMessage,
      onEdit,
      onImport,
    });
  }, [formattedResults, formatMessage, onEdit, onImport]);

  const listHeader = useMemo(() => {
    return buildTableHeader(authoritiesPageTableConfig.columns, formatMessage);
  }, [formatMessage]);

  return { formattedData, listHeader };
}
