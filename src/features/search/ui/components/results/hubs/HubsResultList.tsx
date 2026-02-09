import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { TableFlex } from '@/components/Table';

import { generateHubImportPreviewUrl } from '@/features/hubImport';
import { useHubsTableFormatter } from '@/features/search/ui/hooks/useHubsTableFormatter';

export const HubsResultList: FC = memo(() => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigateToEditPage(generateEditResourceUrl(id));
  };

  const handleImport = (hubToken: string, _hubUri: string) => {
    const previewUrl = generateHubImportPreviewUrl(hubToken);
    navigate(previewUrl);
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
