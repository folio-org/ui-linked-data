import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';

import { MarcPreview } from '@/features/complexLookup/components/MarcPreview';
import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';
import {
  useAuthoritiesModalLogic,
  useComplexLookupModalCleanup,
  useComplexLookupModalState,
} from '@/features/complexLookup/hooks';
import { AuthoritiesResultList } from '@/features/search/ui';
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
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={<FormattedMessage id="ld.selectMarcAuthority" />}
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
            {!isMarcPreviewOpen && (
              <>
                <Search.ControlPane label={<FormattedMessage id="ld.marcAuthority" />} />

                <Search.ContentContainer>
                  <Search.Results>
                    <AuthoritiesResultList
                      context="complexLookup"
                      onAssign={handleAuthoritiesAssign}
                      onTitleClick={handleTitleClick}
                      checkFailedId={checkFailedId}
                    />
                    <Search.Results.Pagination />
                  </Search.Results>
                </Search.ContentContainer>
              </>
            )}

            {/* MARC Preview */}
            {isMarcPreviewOpen && (
              <>
                {isMarcLoading && <Loading />}
                {!isMarcLoading && (
                  <MarcPreview
                    onClose={handleCloseMarcPreview}
                    onAssign={hasComplexFlow ? handleAuthoritiesAssign : undefined}
                    checkFailedId={checkFailedId}
                  />
                )}
              </>
            )}
          </Search.Content>
        </Search>
      </div>
    </Modal>
  );
};
