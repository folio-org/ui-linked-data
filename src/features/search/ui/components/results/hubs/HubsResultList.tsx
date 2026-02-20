import { FC, memo, useCallback } from 'react';

import { StatusType } from '@/common/constants/status.constants';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { useNavigateWithSearchState } from '@/common/hooks/useNavigateWithSearchState';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { TableFlex } from '@/components/Table';

import { generateHubImportPreviewUrl } from '@/features/hubImport';
import { useHubsTableFormatter } from '@/features/search/ui/hooks/useHubsTableFormatter';

import { useLoadingState, useStatusState, useUIState } from '@/store';

export const HubsResultList: FC = memo(() => {
  const { navigateWithState } = useNavigateWithSearchState();
  const { fetchRecord } = useRecordControls();
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { resetFullDisplayComponentType } = useUIState(['resetFullDisplayComponentType']);

  const handleEdit = (id: string) => {
    navigateWithState(generateEditResourceUrl(id));
  };

  const handleImport = (uri: string) => {
    navigateWithState(generateHubImportPreviewUrl(uri));
  };

  const handlePreview = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        resetFullDisplayComponentType();

        await fetchRecord(id, { singular: true });
      } catch (error) {
        logger.error('Error fetching hub record:', error);
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRecord, setIsLoading, resetFullDisplayComponentType, addStatusMessagesItem],
  );

  const { formattedData, listHeader } = useHubsTableFormatter({
    onEdit: handleEdit,
    onImport: handleImport,
    onTitleClick: handlePreview,
  });

  return (
    <div className="search-result-list hubs-search-result-list" data-testid="hubs-search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
});
