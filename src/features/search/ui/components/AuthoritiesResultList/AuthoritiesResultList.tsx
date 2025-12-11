import { FC } from 'react';
import { TableFlex } from '@/components/Table';
import { useFormattedResults } from '../../hooks/useFormattedResults';
import { useTableFormatter } from '../../hooks/useTableFormatter';
import { authoritiesTableConfig } from '../../config/authoritiesTableConfig';
import './AuthoritiesResultList.scss';

interface AuthoritiesResultListProps {
  context?: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  checkFailedId?: (id: string) => boolean;
}

export const AuthoritiesResultList: FC<AuthoritiesResultListProps> = ({
  context = 'search',
  onAssign,
  onTitleClick,
  checkFailedId,
}) => {
  const data = useFormattedResults<SearchResultsTableRow>() || [];
  const { formattedData, listHeader } = useTableFormatter({
    data,
    tableConfig: authoritiesTableConfig,
    context,
    onAssign,
    onTitleClick,
    checkFailedId,
  });

  return (
    <div className="authorities-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-table" />
    </div>
  );
};
