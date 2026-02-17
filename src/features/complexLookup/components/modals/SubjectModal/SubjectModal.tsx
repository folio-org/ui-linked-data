import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { LookupModal } from '@/features/complexLookup/components/LookupModal';
import { AuthoritiesContent, HubsContent } from '@/features/complexLookup/components/content';
import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';
import {
  useAuthoritiesModalLogic,
  useComplexLookupModalCleanup,
  useComplexLookupModalState,
  useHubsModalLogic,
} from '@/features/complexLookup/hooks';
import { SOURCE_OPTIONS } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

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
  const hasComplexFlow = !!(entry && lookupContext && modalConfig);

  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: `authorities:${initialSegment}`,
  });

  const {
    isMarcPreviewOpen,
    isMarcLoading,
    authoritiesData,
    handleTitleClick,
    handleAuthoritiesAssign,
    handleCloseMarcPreview,
    handleResetMarcPreview,
    checkFailedId,
    cleanup,
  } = useAuthoritiesModalLogic({
    entry,
    lookupContext,
    modalConfig,
    onAssign,
    onClose,
    isOpen,
  });

  const { handleHubAssign, isAssigning: isHubAssigning } = useHubsModalLogic({
    onAssign,
    onClose,
  });

  const { handleModalClose } = useComplexLookupModalCleanup({
    onClose,
    withMarcPreview: cleanup,
  });

  return (
    <LookupModal isOpen={isOpen} onClose={handleModalClose} title={<FormattedMessage id="ld.assignSubject" />}>
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
            <AuthoritiesContent
              isMarcPreviewOpen={isMarcPreviewOpen}
              isMarcLoading={isMarcLoading}
              handleAuthoritiesAssign={handleAuthoritiesAssign}
              handleTitleClick={handleTitleClick}
              handleCloseMarcPreview={handleCloseMarcPreview}
              checkFailedId={checkFailedId}
              hasComplexFlow={hasComplexFlow}
            />
          </Search.Controls.SegmentContent>

          <Search.Controls.SegmentContent segment="hubsLookup">
            <HubsContent isAssigning={isHubAssigning} handleHubAssign={handleHubAssign} />
          </Search.Controls.SegmentContent>
        </Search.Content>
      </Search>
    </LookupModal>
  );
};
