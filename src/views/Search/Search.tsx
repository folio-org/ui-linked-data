import { useMemo } from 'react';

import { Dropdown } from '@/components/Dropdown';
import { FullDisplay } from '@/components/FullDisplay';
import { ModalImport } from '@/components/ModalImport';

import { HubsResultList, ResourcesResultList, Search, type SourceOption } from '@/features/search/ui';

import { useSearchState } from '@/store';

import { createHubActionsConfig, createResourceActionsConfig } from './config';
import { useSearchActions, useSearchCleanup } from './hooks';

import './Search.scss';

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
  const { selectedInstances } = useSearchState(['selectedInstances']);

  const { handlePreviewMultiple, handleImport, onClickNewWork, onClickNewHub, navigateToManageProfileSettings } =
    useSearchActions();

  useSearchCleanup();

  const resourceActions = useMemo(
    () =>
      createResourceActionsConfig({
        onClickNewWork,
        handlePreviewMultiple,
        handleImport,
        navigateToManageProfileSettings,
        selectedInstancesCount: selectedInstances.length,
      }),
    [onClickNewWork, handlePreviewMultiple, handleImport, selectedInstances.length],
  );

  const hubActions = useMemo(
    () =>
      createHubActionsConfig({
        onClickNewHub,
      }),
    [onClickNewHub],
  );

  return (
    <div className="search" data-testid="search" id="ld-search-container">
      <Search segments={['resources', 'hubs']} defaultSegment="resources" flow="url" mode="custom">
        <Search.Controls>
          {/* Top-level segments */}
          <Search.Controls.SegmentGroup>
            <Search.Controls.Segment path="resources" labelId="ld.workInstances" />
            <Search.Controls.Segment path="hubs" labelId="ld.hubs" />
          </Search.Controls.SegmentGroup>

          {/* Basic InputsWrapper - only visible for resources segment */}
          <Search.Controls.SegmentContent segment="resources">
            <Search.Controls.InputsWrapper />
          </Search.Controls.SegmentContent>

          {/* InputsWrapper with QueryInput - only visible for hubs segment */}
          <Search.Controls.SegmentContent segment="hubs">
            <Search.Controls.InputsWrapper>
              <Search.Controls.QueryInput placeholder="" />
            </Search.Controls.InputsWrapper>
          </Search.Controls.SegmentContent>

          {/* Common search controls */}
          <Search.Controls.SubmitButton />
          <Search.Controls.MetaControls isCentered={false} />

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
              <Dropdown labelId="ld.actions" items={hubActions} buttonTestId="hubs-actions-dropdown" />
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
                <HubsResultList />
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
  );
};
