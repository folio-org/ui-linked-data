import { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Search, SearchResultList } from '@/features/search/ui';
import { MIN_AMT_OF_INSTANCES_TO_COMPARE } from '@common/constants/search.constants';
import { ModalImport } from '@components/ModalImport';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { DropdownItemType, FullDisplayType } from '@common/constants/uiElements.constants';
import { Dropdown } from '@components/Dropdown';
import { ResourceType } from '@common/constants/record.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Transfer16 from '@src/assets/transfer-16.svg?react';
import Lightning16 from '@src/assets/lightning-16.svg?react';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useNavigateToCreatePage } from '@common/hooks/useNavigateToCreatePage';
import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@common/constants/status.constants';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { resourcesConfig } from '@/features/search/core/config/resources.config';
import { resourcesUIConfig } from '@/features/search/ui/config/resourcesUI.config';
import './Search.scss';

export const SearchView = () => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const { dispatchDropNavigateToOriginEvent } = useContainerEvents();
  const { selectedInstances, resetSelectedInstances } = useSearchState(['selectedInstances', 'resetSelectedInstances']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { fetchRecord } = useRecordControls();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { setFullDisplayComponentType, resetFullDisplayComponentType, isImportModalOpen, setIsImportModalOpen } =
    useUIState([
      'setFullDisplayComponentType',
      'resetFullDisplayComponentType',
      'isImportModalOpen',
      'setIsImportModalOpen',
    ]);
  const { resetPreviewContent } = useInputsState(['resetPreviewContent']);
  const { onCreateNewResource } = useNavigateToCreatePage();

  useEffect(() => {
    return () => {
      resetFullDisplayComponentType();
      resetSelectedInstances();
    };
  }, []);

  dispatchDropNavigateToOriginEvent();

  const handlePreviewMultiple = async () => {
    try {
      setIsLoading(true);
      resetPreviewContent();
      setFullDisplayComponentType(FullDisplayType.Comparison);

      for (const id of selectedInstances.toReversed()) {
        await fetchRecord(id, {});
      }
    } catch (error) {
      console.error(error);

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!isImportModalOpen) {
      setIsImportModalOpen(true);
    }
  };

  const onClickNewWork = () => {
    onCreateNewResource({
      resourceTypeURL: TYPE_URIS.WORK as ResourceTypeURL,
      queryParams: {
        type: ResourceType.work,
      },
    });
  };

  const items = useMemo(
    () => [
      {
        id: 'actions',
        labelId: 'ld.actions',
        data: [
          {
            id: 'newResource',
            type: DropdownItemType.basic,
            labelId: 'ld.newResource',
            icon: <Plus16 />,
            action: onClickNewWork,
          },
          {
            id: 'compare',
            type: DropdownItemType.basic,
            labelId: 'ld.compareSelected',
            icon: <Transfer16 />,
            hidden: selectedInstances.length < MIN_AMT_OF_INSTANCES_TO_COMPARE,
            action: handlePreviewMultiple,
          },
          {
            id: 'import',
            type: DropdownItemType.basic,
            labelId: 'ld.importInstances',
            icon: <Lightning16 />,
            action: handleImport,
          },
        ],
      },
      // Example of the dropdown option with a custom component instead of the standart button
      /* {
      id: 'sortBy',
      labelId: 'ld.newResource',
      data: [
        {
          id: 'sortBy',
          type: DropdownItemType.customComponent,
          renderComponent: (key: string | number) => <div key={key}>Custom</div>,
        },
      ],
    }, */
    ],
    [navigateToEditPage],
  );

  return (
    <div className="search" data-testid="search" id="ld-search-container">
      <Search.Root config={resourcesConfig} uiConfig={resourcesUIConfig} flow="url" mode="auto">
        <Search.Controls />

        <Search.Content>
          <Search.ControlPane label={<FormattedMessage id="ld.resources" />}>
            <Dropdown labelId="ld.actions" items={items} buttonTestId="search-view-actions-dropdown" />
          </Search.ControlPane>

          <Search.ContentContainer>
            <SearchResultList />
            <Search.Pagination />
          </Search.ContentContainer>
        </Search.Content>
      </Search.Root>

      <ModalImport />
    </div>
  );
};
