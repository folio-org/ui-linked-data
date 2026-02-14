import { FC } from 'react';

import { TableFlex } from '@/components/Table';

import { hubsLookupTableConfig } from '@/features/search/ui/config/results/hubsLookupTable.config';
import { useFormattedResults } from '@/features/search/ui/hooks/useFormattedResults';
import { useTableFormatter } from '@/features/search/ui/hooks/useTableFormatter';

interface HubsLookupResultListProps {
  context?: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
}

export const HubsLookupResultList: FC<HubsLookupResultListProps> = ({ context = 'search', onAssign }) => {
  const data = useFormattedResults<SearchResultsTableRow>() || [];
  const { formattedData, listHeader } = useTableFormatter({
    data,
    tableConfig: hubsLookupTableConfig,
    context,
    onAssign,
  });

  return (
    <div className="search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
