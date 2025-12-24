import { FC, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Modal } from '@/components/Modal';
import { Search } from '@/features/search/ui/components/Search';
import { AuthoritiesResultList } from '@/features/search/ui';
import { MarcPreview } from '@/features/complexLookup/components/MarcPreview';
import { Loading } from '@/components/Loading';
import { useComplexLookupModalState, useAuthoritiesMarcPreview } from '@/features/complexLookup/hooks';
import { useAuthoritiesAssignment } from '@/features/complexLookup/hooks/useAuthoritiesAssignment';
import { useUIState, useMarcPreviewState } from '@/store';
import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { ModalConfig } from '@/features/complexLookup/configs/modalRegistry';

interface AuthoritiesModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  initialQuery?: string;
  initialSegment?: 'search' | 'browse';
  entry?: SchemaEntry;
  authority?: string;
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
  authority,
  modalConfig,
  onAssign,
}) => {
  const { isMarcPreviewOpen, setIsMarcPreviewOpen } = useUIState(['isMarcPreviewOpen', 'setIsMarcPreviewOpen']);
  const { resetComplexValue: resetMarcPreviewData, resetMetadata: resetMarcPreviewMetadata } = useMarcPreviewState([
    'resetComplexValue',
    'resetMetadata',
  ]);

  // Determine if complex validation flow is needed
  const hasComplexFlow = !!(entry && authority && modalConfig);
  const marcPreviewEndpoint = modalConfig?.api?.endpoints?.marcPreview;

  // Reset search state and set initial query when modal opens
  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: `authorities:${initialSegment}`,
  });

  // Handle MARC preview loading and state management
  const { loadMarcData, resetPreview, isLoading } = useAuthoritiesMarcPreview({
    endpointUrl: marcPreviewEndpoint || '',
    isMarcPreviewOpen,
  });

  // Complex assignment validation hook
  const assignmentHook = useAuthoritiesAssignment({
    entry: entry || ({} as SchemaEntry),
    authority: authority || '',
    modalConfig: modalConfig || ({} as ModalConfig),
    onAssignSuccess: value => {
      resetPreview();
      setIsMarcPreviewOpen(false);
      onAssign(value);
      onClose();
    },
    enabled: hasComplexFlow,
  });

  // Wrapper to handle opening the preview modal
  const handleTitleClick = useCallback(
    (id: string, title?: string, headingType?: string) => {
      loadMarcData(id, title, headingType);
      setIsMarcPreviewOpen(true);
    },
    [loadMarcData, setIsMarcPreviewOpen],
  );

  const handleAssignClick = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      if (hasComplexFlow && assignmentHook) {
        // Complex flow with validation
        await assignmentHook.handleAssign(record);
      } else {
        // Simple flow - direct assignment, then cleanup
        resetPreview();
        setIsMarcPreviewOpen(false);
        onAssign(record);
        onClose();
      }
    },
    [hasComplexFlow, assignmentHook, resetPreview, setIsMarcPreviewOpen, onAssign, onClose],
  );

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
              <Search.Controls.Segment path="authorities:search" labelId="ld.search" />
              <Search.Controls.Segment path="authorities:browse" labelId="ld.browse" />
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
                      onAssign={handleAssignClick}
                      onTitleClick={handleTitleClick}
                      checkFailedId={assignmentHook?.checkFailedId}
                    />
                    <Search.Results.Pagination />
                  </Search.Results>
                </Search.ContentContainer>
              </>
            )}

            {/* MARC Preview */}
            {isMarcPreviewOpen && (
              <>
                {isLoading && <Loading />}
                {!isLoading && (
                  <MarcPreview
                    onClose={handleCloseMarcPreview}
                    onAssign={hasComplexFlow ? handleAssignClick : undefined}
                    checkFailedId={assignmentHook?.checkFailedId}
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
