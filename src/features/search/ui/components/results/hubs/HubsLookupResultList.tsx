import { FC } from 'react';
import { TableFlex } from '@/components/Table';
import { useFormattedResults } from '../../../hooks/useFormattedResults';
import { useTableFormatter } from '../../../hooks/useTableFormatter';
import { hubsLookupTableConfig } from '../../../config/results/hubsLookupTable.config';

interface HubsLookupResultListProps {
  context?: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  checkFailedId?: (id: string) => boolean;
}

export const HubsLookupResultList: FC<HubsLookupResultListProps> = ({
  context = 'search',
  onAssign,
  checkFailedId,
}) => {
  const data = useFormattedResults<SearchResultsTableRow>() || [];
  const { formattedData, listHeader } = useTableFormatter({
    data,
    tableConfig: hubsLookupTableConfig,
    context,
    onAssign,
    checkFailedId,
  });

  return (
    <div className="search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
