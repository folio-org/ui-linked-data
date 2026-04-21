import { FC, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { StatusType } from '@/common/constants/status.constants';
import { useNavigateToCreatePage } from '@/common/hooks/useNavigateToCreatePage';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { Button, ButtonType } from '@/components/Button';
import { Table } from '@/components/Table';
import { WorkDetailsCard } from '@/components/WorkDetailsCard';

import { formatItemSearchInstanceListData } from '@/features/search/core';
import { instancesTableConfig } from '@/features/search/ui/config';
import { useTableFormatter } from '@/features/search/ui/hooks';

import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@/store';

import CommentIcon from '@/assets/comment-lines-12.svg?react';

import './SearchResultEntry.scss';

type SearchResultEntry = {
  id: string;
  contributors?: ContributorDTO[];
  languages?: string[];
  classifications?: { number?: string; source?: string }[];
  instances?: InstanceAsSearchResultDTO[];
};

export const SearchResultEntry: FC<SearchResultEntry> = ({ instances, ...restOfWork }) => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const { navigationState, selectedInstances, setSelectedInstances } = useSearchState([
    'navigationState',
    'selectedInstances',
    'setSelectedInstances',
  ]);
  const [isOpen, setIsOpen] = useState(true);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { previewContent } = useInputsState(['previewContent']);
  const { resetFullDisplayComponentType, fullDisplayComponentType } = useUIState([
    'resetFullDisplayComponentType',
    'fullDisplayComponentType',
  ]);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const { fetchRecord } = useRecordControls();
  const { onCreateNewResource } = useNavigateToCreatePage();

  const handleOpenPreview = async (id: string) => {
    try {
      setIsLoading(true);
      resetFullDisplayComponentType();

      await fetchRecord(id, { singular: true });
    } catch (error) {
      logger.error('Error fetching record:', error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInstanceSelect = useCallback(
    (id: string, checked: boolean) =>
      setSelectedInstances(prev => (checked ? [...prev, id] : prev.filter(prevId => prevId !== id))),
    [setSelectedInstances],
  );

  const instancesData = useMemo(() => formatItemSearchInstanceListData(instances || []), [instances]);

  const { formattedData, listHeader } = useTableFormatter({
    data: instancesData,
    tableConfig: instancesTableConfig,
    context: 'search',
    onPreview: handleOpenPreview,
    onEdit: navigateToEditPage,
    onToggleSelect: toggleInstanceSelect,
    selectedInstances,
    previewContent,
    fullDisplayComponentType,
  });

  const onClickNewInstance = () => {
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.INSTANCE as ResourceTypeURL,
      queryParams: {
        type: ResourceType.instance,
        refId: restOfWork.id,
      },
      navigationState,
    });
  };

  return (
    <div className="search-result-entry-container">
      <WorkDetailsCard
        isOpen={isOpen}
        toggleIsOpen={toggleIsOpen}
        handleOpenPreview={handleOpenPreview}
        {...restOfWork}
      />
      {!!instances?.length && isOpen && (
        <Table
          header={listHeader}
          data={formattedData}
          selectedRows={previewContent?.map(({ id }) => id)}
          className="instance-list"
        />
      )}
      {!isOpen && (
        <div className="empty-or-closed">
          <CommentIcon />
          <span>
            <FormattedMessage id="ld.instances" />
          </span>
          <span>{instances?.length ?? 0}</span>
        </div>
      )}
      {!instances?.length && isOpen && (
        <div className="empty-or-closed">
          <span>
            <span>
              <FormattedMessage id="ld.noInstancesAvailable" />
            </span>
            <Button type={ButtonType.Link} onClick={onClickNewInstance} data-testid="add-instance">
              <FormattedMessage id="ld.addAnInstance" />
            </Button>
          </span>
        </div>
      )}
    </div>
  );
};
