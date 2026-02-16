import { FC, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';

import { MarcPreview } from '@/features/complexLookup/components/MarcPreview';
import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';
import {
  useAuthoritiesMarcPreview,
  useAuthoritiesSegmentData,
  useComplexLookupModalState,
} from '@/features/complexLookup/hooks';
import { useAuthoritiesAssignment } from '@/features/complexLookup/hooks/useAuthoritiesAssignment';
import { useHubAssignment } from '@/features/complexLookup/hooks/useHubAssignment';
import { AuthoritiesResultList, HubsLookupResultList, SOURCE_OPTIONS } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

import { useMarcPreviewState, useUIState } from '@/store';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  initialQuery?: string;
  initialSegment?: 'search' | 'browse';
  entry?: SchemaEntry;
  lookupContext?: string;
  modalConfig?: ModalConfig;
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
}

export const SubjectModal: FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  initialSegment = 'browse',
  entry,
  lookupContext,
  modalConfig,
  onAssign,
}) => {
  const { isMarcPreviewOpen, setIsMarcPreviewOpen } = useUIState(['isMarcPreviewOpen', 'setIsMarcPreviewOpen']);
  const { resetComplexValue: resetMarcPreviewData, resetMetadata: resetMarcPreviewMetadata } = useMarcPreviewState([
    'resetComplexValue',
    'resetMetadata',
  ]);

  const hasComplexFlow = !!(entry && lookupContext && modalConfig);
  const marcPreviewEndpoint = modalConfig?.api?.endpoints?.marcPreview;
  const sourceEndpoint = modalConfig?.api?.endpoints?.source;
  const facetsEndpoint = modalConfig?.api?.endpoints?.facets;

  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: `authorities:${initialSegment}`,
  });

  const authoritiesData = useAuthoritiesSegmentData({
    sourceEndpoint,
    facetsEndpoint,
    facet: 'sourceFileId',
    autoLoadOnMount: true,
    isOpen,
  });

  const {
    loadMarcData,
    resetPreview,
    isLoading: isMarcLoading,
  } = useAuthoritiesMarcPreview({
    endpointUrl: marcPreviewEndpoint || '',
    isMarcPreviewOpen,
  });

  const handleSuccessfulAuthoritiesAssignment = useCallback(
    (value: UserValueContents | ComplexLookupAssignRecordDTO) => {
      resetPreview();
      setIsMarcPreviewOpen(false);
      onAssign(value);
      onClose();
    },
    [resetPreview, setIsMarcPreviewOpen, onAssign, onClose],
  );

  const authoritiesAssignment = useAuthoritiesAssignment({
    entry: entry || ({} as SchemaEntry),
    lookupContext: lookupContext || '',
    modalConfig: modalConfig || ({} as ModalConfig),
    onAssignSuccess: handleSuccessfulAuthoritiesAssignment,
    enabled: hasComplexFlow,
  });

  const handleSuccessfulHubAssignment = useCallback(
    (value: UserValueContents) => {
      onAssign(value);
      onClose();
    },
    [onAssign, onClose],
  );

  const hubAssignment = useHubAssignment({
    onAssignSuccess: handleSuccessfulHubAssignment,
  });

  const handleTitleClick = useCallback(
    (id: string, title?: string, headingType?: string) => {
      loadMarcData(id, title, headingType);
      setIsMarcPreviewOpen(true);
    },
    [loadMarcData, setIsMarcPreviewOpen],
  );

  const handleAuthoritiesAssign = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      if (hasComplexFlow) {
        await authoritiesAssignment.handleAssign(record);
      }
    },
    [hasComplexFlow, authoritiesAssignment],
  );

  const handleHubAssign = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      await hubAssignment.handleAssign(record);
    },
    [hubAssignment],
  );

  const handleResetMarcPreview = useCallback(() => {
    resetPreview();
    setIsMarcPreviewOpen(false);
  }, [resetPreview, setIsMarcPreviewOpen]);

  const handleCloseMarcPreview = useCallback(() => {
    resetPreview();
    setIsMarcPreviewOpen(false);
  }, [resetPreview, setIsMarcPreviewOpen]);

  const handleModalClose = useCallback(() => {
    setIsMarcPreviewOpen(false);
    resetMarcPreviewData();
    resetMarcPreviewMetadata();
    resetPreview();
    onClose();
  }, [setIsMarcPreviewOpen, resetMarcPreviewData, resetMarcPreviewMetadata, resetPreview, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={<FormattedMessage id="ld.assignSubject" />}
      titleClassName="modal-complex-lookup-title"
      className={classNames(['modal-complex-lookup', IS_EMBEDDED_MODE && 'modal-complex-lookup-embedded'])}
      classNameHeader={classNames([
        'modal-complex-lookup-header',
        IS_EMBEDDED_MODE && 'modal-complex-lookup-header-embedded',
      ])}
      showModalControls={false}
    >
      <div className="complex-lookup-search-contents" data-testid="complex-lookup-search-contents">
        <Search
          segments={['authorities:search', 'authorities:browse', 'hubsLookup']}
          defaultSegment={`authorities:${initialSegment}`}
          flow="value"
          mode="custom"
        >
          <Search.Controls>
            <Search.Controls.SegmentGroup>
              <Search.Controls.Segment
                path="authorities"
                defaultTo="authorities:browse"
                labelId="ld.authorities"
                onAfterChange={authoritiesData.onSegmentEnter}
              />
              <Search.Controls.Segment path="hubsLookup" labelId="ld.hubs" onBeforeChange={handleResetMarcPreview} />
            </Search.Controls.SegmentGroup>

            <Search.Controls.SegmentGroup parentPath="authorities">
              <Search.Controls.Segment
                path="authorities:search"
                labelId="ld.search"
                onAfterChange={authoritiesData.onSegmentEnter}
              />
              <Search.Controls.Segment
                path="authorities:browse"
                labelId="ld.browse"
                onAfterChange={authoritiesData.onSegmentEnter}
              />
            </Search.Controls.SegmentGroup>

            <Search.Controls.InputsWrapper />
            <Search.Controls.SubmitButton />
            <Search.Controls.MetaControls />

            <Search.Controls.SegmentContent segment="hubsLookup">
              <Search.Controls.SourceSelector options={SOURCE_OPTIONS} defaultValue="libraryOfCongress" />
            </Search.Controls.SegmentContent>
          </Search.Controls>

          <Search.Content>
            <Search.Controls.SegmentContent segment="authorities" matchPrefix>
              {!isMarcPreviewOpen && (
                <>
                  <Search.ControlPane label={<FormattedMessage id="ld.marcAuthority" />} />
                  <Search.ContentContainer>
                    <Search.Results>
                      <AuthoritiesResultList
                        context="complexLookup"
                        onAssign={handleAuthoritiesAssign}
                        onTitleClick={handleTitleClick}
                        checkFailedId={authoritiesAssignment?.checkFailedId}
                      />
                      <Search.Results.Pagination />
                    </Search.Results>
                  </Search.ContentContainer>
                </>
              )}

              {isMarcPreviewOpen && (
                <>
                  {isMarcLoading && <Loading />}
                  {!isMarcLoading && (
                    <MarcPreview
                      onClose={handleCloseMarcPreview}
                      onAssign={hasComplexFlow ? handleAuthoritiesAssign : undefined}
                      checkFailedId={authoritiesAssignment?.checkFailedId}
                    />
                  )}
                </>
              )}
            </Search.Controls.SegmentContent>

            <Search.Controls.SegmentContent segment="hubsLookup">
              <Search.ControlPane label={<FormattedMessage id="ld.hubs" />} showSubLabel={true} />
              <Search.ContentContainer>
                {hubAssignment.isAssigning && <Loading />}

                {!hubAssignment.isAssigning && (
                  <Search.Results>
                    <HubsLookupResultList context="complexLookup" onAssign={handleHubAssign} />
                    <Search.Results.Pagination />
                  </Search.Results>
                )}
              </Search.ContentContainer>
            </Search.Controls.SegmentContent>
          </Search.Content>
        </Search>
      </div>
    </Modal>
  );
};
