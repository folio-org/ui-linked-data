import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { LookupModal } from '@/features/complexLookup/components/LookupModal';
import { AuthoritiesContent } from '@/features/complexLookup/components/content';
import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';
import {
  useAuthoritiesModalLogic,
  useComplexLookupModalCleanup,
  useComplexLookupModalState,
} from '@/features/complexLookup/hooks';
import { Search } from '@/features/search/ui/components/Search';

interface AuthoritiesModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  initialQuery?: string;
  initialSegment?: 'search' | 'browse';
  entry?: SchemaEntry;
  lookupContext?: string;
  modalConfig?: ModalConfig;
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
}

/**
 * AuthoritiesModal - Modal wrapper for Authority lookup using new Search feature.
 */
export const AuthoritiesModal: FC<AuthoritiesModalProps> = ({
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

  // Reset search state and set initial query when modal opens
  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: `authorities:${initialSegment}`,
  });

  // Authorities-specific logic (MARC preview, data loading, assignment)
  const {
    isMarcPreviewOpen,
    isMarcLoading,
    authoritiesData,
    handleTitleClick,
    handleAuthoritiesAssign,
    handleCloseMarcPreview,
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

  // Modal cleanup handler
  const { handleModalClose } = useComplexLookupModalCleanup({
    onClose,
    withMarcPreview: cleanup,
  });

  return (
    <LookupModal isOpen={isOpen} onClose={handleModalClose} title={<FormattedMessage id="ld.selectMarcAuthority" />}>
      <Search
        segments={['authorities:search', 'authorities:browse']}
        defaultSegment={`authorities:${initialSegment}`}
        flow="value"
        mode="custom"
      >
        <Search.Controls>
          {/* Segment tabs - clicking triggers onSegmentChange, auto-resolves new config */}
          <Search.Controls.SegmentGroup>
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
        </Search.Controls>

        <Search.Content>
          <AuthoritiesContent
            isMarcPreviewOpen={isMarcPreviewOpen}
            isMarcLoading={isMarcLoading}
            handleAuthoritiesAssign={handleAuthoritiesAssign}
            handleTitleClick={handleTitleClick}
            handleCloseMarcPreview={handleCloseMarcPreview}
            checkFailedId={checkFailedId}
            hasComplexFlow={hasComplexFlow}
          />
        </Search.Content>
      </Search>
    </LookupModal>
  );
};
