import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Search } from '@components/Search';
import { SearchResultList } from '@components/SearchResultList';
import { DEFAULT_SEARCH_BY, MIN_AMT_OF_INSTANCES_TO_COMPARE } from '@common/constants/search.constants';
import { SearchControlPane } from '@components/SearchControlPane';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { DropdownItemType, FullDisplayType } from '@common/constants/uiElements.constants';
import { ROUTES } from '@common/constants/routes.constants';
import { Dropdown } from '@components/Dropdown';
import { ResourceType } from '@common/constants/record.constants';
import { SEARCH_RESOURCE_API_ENDPOINT } from '@common/constants/api.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import Plus16 from '@src/assets/plus-16.svg?react';
import Transfer16 from '@src/assets/transfer-16.svg?react';
import { filters } from './data/filters';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@common/constants/status.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import './Search.scss';

export const SearchView = () => {
  const { navigateToEditPage } = useNavigateToEditPage();
  const { dispatchDropNavigateToOriginEvent } = useContainerEvents();
  const { selectedInstances } = useSearchState();
  const { setIsLoading } = useLoadingState();
  const { fetchRecord } = useRecordControls();
  const { addStatusMessagesItem } = useStatusState();
  const { setFullDisplayComponentType } = useUIState();
  const { resetPreviewContent } = useInputsState();
  
  dispatchDropNavigateToOriginEvent();

  const handlePreviewMultiple = async () => {
    try {
      setIsLoading(true);
      resetPreviewContent();
      setFullDisplayComponentType(FullDisplayType.Comparison)

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
            action: () => {
              navigateToEditPage(`${ROUTES.RESOURCE_CREATE.uri}?type=${ResourceType.work}`);
            },
          },
          {
            id: 'compare',
            type: DropdownItemType.basic,
            labelId: 'ld.compareSelected',
            icon: <Transfer16 />,
            hidden: selectedInstances.length < MIN_AMT_OF_INSTANCES_TO_COMPARE,
            action: handlePreviewMultiple,
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
    </div>
  );
};
