import { FC, memo } from 'react';

import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { TableFlex } from '@/components/Table';

import { useHubsTableFormatter } from '@/features/search/ui/hooks/useHubsTableFormatter';

export const HubsResultList: FC = memo(() => {
  const { navigateToEditPage } = useNavigateToEditPage();

  const handleEdit = (id: string) => {
    navigateToEditPage(generateEditResourceUrl(id));
  };

  // TODO: implement Hub import functionality
  const handleImport = (_id: string, _uri: string) => {};

  const { formattedData, listHeader } = useHubsTableFormatter({
    onEdit: handleEdit,
    onImport: handleImport,
  });

  return (
    <div className="search-result-list hubs-search-result-list" data-testid="hubs-search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
});
