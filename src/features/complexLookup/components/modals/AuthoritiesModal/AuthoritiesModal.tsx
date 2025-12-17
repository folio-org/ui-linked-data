import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Modal } from '@/components/Modal';
import { Search } from '@/features/search/ui/components/Search';
import { AuthoritiesResultList } from '@/features/search/ui';
import { MarcPreview } from '@/features/complexLookup/components/MarcPreview';
import { useComplexLookupModalState } from '@/features/complexLookup/hooks';
import { useUIState } from '@/store';
import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';

interface AuthoritiesModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  initialQuery?: string;
  initialSegment?: 'search' | 'browse';
  baseLabelType?: string;
  onAssign: (record: ComplexLookupAssignRecordDTO) => void;
}

/**
 * AuthoritiesModal - Modal wrapper for Authority lookup using new Search feature.
 */
export const AuthoritiesModal: FC<AuthoritiesModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  initialSegment = 'browse',
  baseLabelType = 'creator',
  onAssign,
}) => {
  const { isMarcPreviewOpen } = useUIState(['isMarcPreviewOpen']);

  const titleId = baseLabelType === 'subject' ? 'ld.selectMarcAuthority.subject' : 'ld.selectMarcAuthority';

  // Reset search state and set initial query when modal opens
  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: `authorities:${initialSegment}`,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<FormattedMessage id={titleId} />}
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
                    {/* Existing component already supports complexLookup context! */}
                    <AuthoritiesResultList context="complexLookup" onAssign={onAssign} />
                    <Search.Results.Pagination />
                  </Search.Results>
                </Search.ContentContainer>
              </>
            )}

            {/* MARC Preview (authorities-specific feature) */}
            {isMarcPreviewOpen && <MarcPreview onClose={onClose} />}
          </Search.Content>
        </Search>
      </div>
    </Modal>
  );
};
