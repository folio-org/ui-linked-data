import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { LookupModal } from '@/features/complexLookup/components/LookupModal';
import { HubsContent } from '@/features/complexLookup/components/content';
import { useComplexLookupModalState, useHubsModalLogic } from '@/features/complexLookup/hooks';
import { SOURCE_OPTIONS } from '@/features/search/ui';
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

  // Hub-specific logic (assignment with import-on-assign)
  const { handleHubAssign, isAssigning } = useHubsModalLogic({
    onAssign,
    onClose,
  });

  return (
    <LookupModal isOpen={isOpen} onClose={onClose} title={<FormattedMessage id="ld.hubs.assign" />}>
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
          <HubsContent isAssigning={isAssigning} handleHubAssign={handleHubAssign} />
        </Search.Content>
      </Search>
    </LookupModal>
  );
};
