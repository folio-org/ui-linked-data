import { FC, memo } from 'react';

import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateWithSearchState } from '@/common/hooks/useNavigateWithSearchState';
import { TableFlex } from '@/components/Table';

import { generateHubImportPreviewUrl } from '@/features/hubImport';
import { useHubsTableFormatter } from '@/features/search/ui/hooks/useHubsTableFormatter';

export const HubsResultList: FC = memo(() => {
  const { navigateWithState } = useNavigateWithSearchState();

  const handleEdit = (id: string) => {
    navigateWithState(generateEditResourceUrl(id));
  };

  const handleImport = (uri: string) => {
    navigateWithState(generateHubImportPreviewUrl(uri));
  };

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
