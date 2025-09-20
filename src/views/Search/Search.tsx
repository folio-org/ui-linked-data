import { useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Search } from '@components/Search';
import { SearchResultList } from '@components/SearchResultList';
import { DEFAULT_SEARCH_BY, MIN_AMT_OF_INSTANCES_TO_COMPARE } from '@common/constants/search.constants';
import { SearchControlPane } from '@components/SearchControlPane';
import { ModalImport } from '@components/ModalImport';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { DropdownItemType, FullDisplayType } from '@common/constants/uiElements.constants';
import { Dropdown } from '@components/Dropdown';
import { ResourceType } from '@common/constants/record.constants';
import { SEARCH_RESOURCE_API_ENDPOINT } from '@common/constants/api.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Transfer16 from '@src/assets/transfer-16.svg?react';
import Lightning16 from '@src/assets/lightning-16.svg?react';
import { filters } from './data/filters';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useNavigateToCreatePage } from '@common/hooks/useNavigateToCreatePage';
import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@common/constants/status.constants';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
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

  const handleImport = async () => {
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

  const renderSearchControlPane = useCallback(
    () => (
      <SearchControlPane label={<FormattedMessage id="ld.resources" />}>
        <Dropdown labelId="ld.actions" items={items} buttonTestId="search-view-actions-dropdown" />
      </SearchControlPane>
    ),
    [items],
  );
  const renderResultsList = useCallback(() => <SearchResultList />, []);

  return (
    <div className="search" data-testid="search" id="ld-search-container">
      <Search
        endpointUrl={SEARCH_RESOURCE_API_ENDPOINT}
        filters={filters}
        hasSearchParams={true}
        defaultSearchBy={DEFAULT_SEARCH_BY}
        labelEmptySearch="ld.enterSearchCriteria"
        isVisibleFilters={SEARCH_FILTERS_ENABLED}
        isVisibleFullDisplay={true}
        isVisibleAdvancedSearch={true}
        isVisibleSearchByControl={true}
        renderSearchControlPane={renderSearchControlPane}
        renderResultsList={renderResultsList}
      />
      <ModalImport />
    </div>
  );
};
