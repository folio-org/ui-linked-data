import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { LookupModal } from '@/features/complexLookup/components/LookupModal';
import { HubsContent } from '@/features/complexLookup/components/content';
import { useComplexLookupModalState } from '@/features/complexLookup/hooks';
import { getDefaultHubSource } from '@/features/complexLookup/utils';
import { SOURCE_OPTIONS } from '@/features/search/ui';
import { Search } from '@/features/search/ui/components/Search';

interface HubsModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  assignedValue?: UserValueContents;
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
}

/**
 * HubsModal - Modal wrapper for Hub lookup using new Search feature.
 * Supports import-on-assign for external hubs.
 */
export const HubsModal: FC<HubsModalProps> = ({ isOpen, onClose, assignedValue, onAssign }) => {
  const defaultSource = getDefaultHubSource(assignedValue);

  // Reset search state and set initial query when modal opens
  useComplexLookupModalState({
    isOpen,
    assignedValue,
    defaultSegment: 'hubsLookup',
    defaultSource,
  });

  return (
    <LookupModal isOpen={isOpen} onClose={onClose} title={<FormattedMessage id="ld.hubs.assign" />}>
      <Search
        segments={['hubsLookup']}
        defaultSegment="hubsLookup"
        defaultSource={defaultSource}
        flow="value"
        mode="custom"
      >
        <Search.Controls>
          <Search.Controls.InputsWrapper />
          <Search.Controls.SubmitButton />
          <Search.Controls.MetaControls />

          <Search.Controls.SourceSelector options={SOURCE_OPTIONS} defaultValue={defaultSource} />
        </Search.Controls>

        <Search.Content>
          <HubsContent onAssign={onAssign} onClose={onClose} />
        </Search.Content>
      </Search>
    </LookupModal>
  );
};
