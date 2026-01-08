import { FC } from 'react';
import { TableFlex } from '@/components/Table';
import { SpinnerEllipsis } from '@/components/SpinnerEllipsis';
import { useHubsTableFormatter } from '../../../hooks/useHubsTableFormatter';

interface HubsResultListProps {
  onEdit?: (id: string) => void;
  onImport?: (id: string, uri: string) => void;
}

export const HubsResultList: FC<HubsResultListProps> = ({ onEdit, onImport }) => {
  const { formattedData, listHeader, isLoading } = useHubsTableFormatter({
    onEdit,
    onImport,
  });

  return (
    <div className="search-result-list hubs-search-result-list" data-testid="hubs-search-result-list">
      {isLoading ? (
        <div className="search-result-list-loading">
          <SpinnerEllipsis />
        </div>
      ) : (
        <TableFlex header={listHeader} data={formattedData} className="results-list" />
      )}
    </div>
  );
};
