import { FC, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';

import { useComplexLookupModalState } from '@/features/complexLookup/hooks';
import { useHubAssignment } from '@/features/complexLookup/hooks/useHubAssignment';
import { HubsLookupResultList, SOURCE_OPTIONS } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

interface HubsModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  initialQuery?: string;
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
}

/**
 * HubsModal - Modal wrapper for Hub lookup using new Search feature.
 * Supports import-on-assign for external hubs.
 */
export const HubsModal: FC<HubsModalProps> = ({ isOpen, onClose, initialQuery, onAssign }) => {
  // Reset search state and set initial query when modal opens
  useComplexLookupModalState({
    isOpen,
    initialQuery,
    defaultSegment: 'hubsLookup',
    defaultSource: 'libraryOfCongress',
  });

  const handleSuccessfulAssignment = useCallback(
    (value: UserValueContents) => {
      onAssign(value);
      onClose();
    },
    [onAssign, onClose],
  );

  const { handleAssign, isAssigning } = useHubAssignment({
    onAssignSuccess: handleSuccessfulAssignment,
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
        <Search
          segments={['hubsLookup']}
          defaultSegment="hubsLookup"
          defaultSource="libraryOfCongress"
          flow="value"
          mode="custom"
        >
          <Search.Controls>
            <Search.Controls.InputsWrapper />
            <Search.Controls.SubmitButton />
            <Search.Controls.MetaControls />

            <Search.Controls.SourceSelector options={SOURCE_OPTIONS} defaultValue="libraryOfCongress" />
          </Search.Controls>

          <Search.Content>
            <Search.ControlPane label={<FormattedMessage id="ld.hubs" />} showSubLabel={true} />

            <Search.ContentContainer>
              {isAssigning && <Loading />}

              {!isAssigning && (
                <Search.Results>
                  <HubsLookupResultList context="complexLookup" onAssign={handleAssign} />
                  <Search.Results.Pagination />
                </Search.Results>
              )}
            </Search.ContentContainer>
          </Search.Content>
        </Search>
      </div>
    </Modal>
  );
};
