import { FC } from 'react';
import { useIntl } from 'react-intl';

import { TableFlex } from '@/components/Table';

import { authoritiesTableConfig } from '../../../config/results/authoritiesTable.config';
import { useFormattedResults } from '../../../hooks/useFormattedResults';
import { useTableFormatter } from '../../../hooks/useTableFormatter';

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
  const data = useFormattedResults<SearchResultsTableRow>({ notSpecifiedLabel: fallbackLabel }) || [];
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
