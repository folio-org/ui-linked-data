import { FC, memo } from 'react';
import { TableFlex } from '@/components/Table';
import { useHubsTableFormatter } from '../../../hooks/useHubsTableFormatter';

interface HubsResultListProps {
  onEdit?: (id: string) => void;
  onImport?: (id: string, uri: string) => void;
}

export const HubsResultList: FC<HubsResultListProps> = memo(({ onEdit, onImport }) => {
  const { formattedData, listHeader } = useHubsTableFormatter({
    onEdit,
    onImport,
  });

  return (
    <div className="search-result-list hubs-search-result-list" data-testid="hubs-search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
});
