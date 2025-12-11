import { FC } from 'react';
import { TableFlex } from '@/components/Table';
import { useFormattedResults } from '../../hooks/useFormattedResults';
import { useTableFormatter } from '../../hooks/useTableFormatter';
import { hubsTableConfig } from '../../config/results/hubsTable.config';
import './HubsResultList.scss';

interface HubsResultListProps {
  context?: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  checkFailedId?: (id: string) => boolean;
}

export const HubsResultList: FC<HubsResultListProps> = ({ context = 'search', onAssign, checkFailedId }) => {
  const data = useFormattedResults<SearchResultsTableRow>() || [];
  const { formattedData, listHeader } = useTableFormatter({
    data,
    tableConfig: hubsTableConfig,
    context,
    onAssign,
    checkFailedId,
  });

  return (
    <div className="hubs-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-table" />
    </div>
  );
};
