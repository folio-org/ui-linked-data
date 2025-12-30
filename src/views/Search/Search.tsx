import { useCallback, useEffect, useMemo } from 'react';
import { logger } from '@/common/services/logger';
import {
  LegacySearch,
  LegacySearchControlPane,
  Search,
  ResourcesResultList,
  HubsResultList,
  LegacySearchResultList,
  type SourceOption,
} from '@/features/search/ui';
import { DEFAULT_SEARCH_BY, MIN_AMT_OF_INSTANCES_TO_COMPARE, SearchSegment } from '@/common/constants/search.constants';
import { ModalImport } from '@/components/ModalImport';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { DropdownItemType, FullDisplayType } from '@/common/constants/uiElements.constants';
import { Dropdown } from '@/components/Dropdown';
import { ResourceType } from '@/common/constants/record.constants';
import Plus16 from '@/assets/plus-16.svg?react';
import Transfer16 from '@/assets/transfer-16.svg?react';
import Lightning16 from '@/assets/lightning-16.svg?react';
import { useContainerEvents } from '@/common/hooks/useContainerEvents';
import { useNavigateToCreatePage } from '@/common/hooks/useNavigateToCreatePage';
import { useInputsState, useLoadingState, useSearchState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@/common/constants/status.constants';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { IS_NEW_SEARCH_ENABLED, SEARCH_FILTERS_ENABLED } from '@/common/constants/feature.constants';
import { getByIdentifier } from '@/common/api/search.api';
import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import { filters } from './data/filters';
import { FormattedMessage } from 'react-intl';
import './Search.scss';
import { FullDisplay } from '@/components/FullDisplay';

const SOURCE_OPTIONS: SourceOption[] = [
  {
    value: 'libraryOfCongress',
    labelId: 'ld.source.libraryOfCongress',
  },
  {
    value: 'local',
    labelId: 'ld.source.local',
  },
];

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
      logger.error('Error fetching records for preview:', error);

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

  const resourceActions = useMemo(
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
    [navigateToEditPage, selectedInstances.length],
  );

  const renderSearchControlPane = useCallback(
    () => (
      <LegacySearchControlPane label={<FormattedMessage id="ld.resources" />}>
        <Dropdown labelId="ld.actions" items={resourceActions} buttonTestId="search-view-actions-dropdown" />
      </LegacySearchControlPane>
    ),
    [resourceActions],
  );
  const renderResultsList = useCallback(() => <LegacySearchResultList />, []);

  return IS_NEW_SEARCH_ENABLED ? (
    <div className="search" data-testid="search" id="ld-search-container">
      <Search segments={['resources', 'hubs']} defaultSegment="resources" flow="url" mode="custom">
        <Search.Controls>
          {/* Top-level segments */}
          <Search.Controls.SegmentGroup>
            <Search.Controls.Segment path="resources" labelId="ld.resources" />
            <Search.Controls.Segment path="hubs" labelId="ld.hubs" />
          </Search.Controls.SegmentGroup>

          {/* Common search controls */}
          <Search.Controls.InputsWrapper />
          <Search.Controls.SubmitButton />
          <Search.Controls.MetaControls />

          {/* Source selector - only visible for hubs segment */}
          <Search.Controls.SegmentContent segment="hubs">
            <Search.Controls.SourceSelector options={SOURCE_OPTIONS} defaultValue="libraryOfCongress" />
          </Search.Controls.SegmentContent>
        </Search.Controls>

        <Search.Content>
          {/* Resources-specific actions */}
          <Search.Controls.SegmentContent segment="resources">
            <Search.ControlPane>
              <Dropdown labelId="ld.actions" items={resourceActions} buttonTestId="resources-actions-dropdown" />
            </Search.ControlPane>
          </Search.Controls.SegmentContent>

          {/* Hubs-specific actions */}
          <Search.Controls.SegmentContent segment="hubs">
            <Search.ControlPane>
              <Dropdown labelId="ld.actions" items={resourceActions} buttonTestId="hubs-actions-dropdown" />
            </Search.ControlPane>
          </Search.Controls.SegmentContent>

          <Search.ContentContainer>
            {/* Resources segment: Work cards with instances table */}
            <Search.Controls.SegmentContent segment="resources">
              <Search.Results className="search-results-container">
                <ResourcesResultList />
                <Search.Results.Pagination />
              </Search.Results>
            </Search.Controls.SegmentContent>

            {/* Hubs segment: table with external links */}
            <Search.Controls.SegmentContent segment="hubs">
              <Search.Results className="search-results-container hubs-result-list">
                <HubsResultList context="search" />
                <Search.Results.Pagination />
              </Search.Results>
            </Search.Controls.SegmentContent>
          </Search.ContentContainer>
        </Search.Content>

        {/* Preview panel */}
        <FullDisplay />
      </Search>

      <ModalImport />
    </div>
  ) : (
    <div className="search" data-testid="search" id="ld-search-container">
      <LegacySearch
        endpointUrl={SEARCH_API_ENDPOINT.RESOURCES}
        sameOrigin={true}
        filters={filters}
        hasSearchParams={true}
        fetchSearchResults={getByIdentifier}
        defaultSearchBy={DEFAULT_SEARCH_BY}
        defaultNavigationSegment={SearchSegment.Search}
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
