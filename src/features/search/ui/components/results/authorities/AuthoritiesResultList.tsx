import { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TableFlex } from '@/components/Table';

import { authoritiesTableConfig } from '@/features/search/ui/config';
import { useFormattedResults, useTableFormatter } from '@/features/search/ui/hooks';

import '../resultsList.scss';

interface AuthoritiesResultListProps {
  context?: 'search' | 'complexLookup';
  notSpecifiedLabel?: string;
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  checkFailedId?: (id: string) => boolean;
}

export const AuthoritiesResultList: FC<AuthoritiesResultListProps> = ({
  context = 'search',
  notSpecifiedLabel,
  onAssign,
  onTitleClick,
  checkFailedId,
}) => {
  const { formatMessage } = useIntl();
  const fallbackLabel = notSpecifiedLabel ?? formatMessage({ id: 'ld.notSpecified' });
  const formatterOptions = useMemo(() => ({ notSpecifiedLabel: fallbackLabel }), [fallbackLabel]);
  const data = useFormattedResults<SearchResultsTableRow>(formatterOptions) || [];
  const { formattedData, listHeader } = useTableFormatter({
    data,
    tableConfig: authoritiesTableConfig,
    context,
    onAssign,
    onTitleClick,
    checkFailedId,
  });

  return (
    <div className="search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
