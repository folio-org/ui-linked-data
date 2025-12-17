import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Modal } from '@/components/Modal';
import { Search } from '@/features/search/ui/components/Search';
import { HubsResultList } from '@/features/search/ui';
import { useComplexLookupModalState } from '@/features/complexLookup/hooks';
import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';

interface HubsModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  initialQuery?: string;
  onAssign: (record: ComplexLookupAssignRecordDTO) => void;
}

/**
 * HubsModal - Modal wrapper for Hub lookup using new Search feature.
 */
export const HubsModal: FC<HubsModalProps> = ({ isOpen, onClose, initialQuery, onAssign }) => {
  // Reset search state and set initial query when modal opens
  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: 'hubs',
    defaultSource: 'external',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<FormattedMessage id="ld.hubs.assign" />}
      titleClassName="modal-complex-lookup-title"
      className={classNames(['modal-complex-lookup', IS_EMBEDDED_MODE && 'modal-complex-lookup-embedded'])}
      classNameHeader={classNames([
        'modal-complex-lookup-header',
        IS_EMBEDDED_MODE && 'modal-complex-lookup-header-embedded',
      ])}
      showModalControls={false}
    >
      <div className="complex-lookup-search-contents" data-testid="complex-lookup-search-contents">
        <Search segments={['hubs']} defaultSegment="hubs" defaultSource="external" flow="value" mode="custom">
          <Search.Controls>
            <Search.Controls.InputsWrapper />
            <Search.Controls.SubmitButton />
            <Search.Controls.MetaControls />
          </Search.Controls>

          <Search.Content>
            <Search.ControlPane label={<FormattedMessage id="ld.hubs" />} />

            <Search.ContentContainer>
              <Search.Results>
                {/* Existing component already supports complexLookup context! */}
                <HubsResultList context="complexLookup" onAssign={onAssign} />
                <Search.Results.Pagination />
              </Search.Results>
            </Search.ContentContainer>
          </Search.Content>
        </Search>
      </div>
    </Modal>
  );
};
