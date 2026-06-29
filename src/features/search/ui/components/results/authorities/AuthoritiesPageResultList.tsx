import { FC, memo } from 'react';

import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateWithSearchState } from '@/common/hooks/useNavigateWithSearchState';
import { TableFlex } from '@/components/Table';

import { useAuthoritiesPageTableFormatter } from '@/features/search/ui/hooks';

import '../resultsList.scss';

export const AuthoritiesPageResultList: FC = memo(() => {
  const { navigateWithState } = useNavigateWithSearchState();

  const handleEdit = (id: string) => {
    navigateWithState(generateEditResourceUrl(id));
  };

  const handleImport = (_id: string) => {
    // TODO: Import behavior is out of scope for the initial implementation
  };

  const { formattedData, listHeader } = useAuthoritiesPageTableFormatter({
    onEdit: handleEdit,
    onImport: handleImport,
  });

  return (
    <div className="search-result-list" data-testid="authorities-search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
});
