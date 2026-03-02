import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { SOURCE_TYPES } from '@/common/constants/lookup.constants';

import { LookupModal } from '@/features/complexLookup/components/LookupModal';
import { HubsContent } from '@/features/complexLookup/components/content';
import { useComplexLookupModalState, useModalWithHubPreview } from '@/features/complexLookup/hooks';
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
 * Supports import-on-assign for external hubs and preview for local hubs.
 */
export const HubsModal: FC<HubsModalProps> = ({ isOpen, onClose, assignedValue, onAssign }) => {
  const defaultSource = SOURCE_TYPES.LIBRARY_OF_CONGRESS;

  // Reset search state and set initial query when modal opens
  // defaultSource is config default (LoC), assigned source is extracted from assignedValue.meta
  useComplexLookupModalState({
    isOpen,
    assignedValue,
    defaultSegment: 'hubsLookup',
    defaultSource,
  });

  // Hub preview integration - handles preview state, assignment, and cleanup
  const { hubPreviewProps, handleModalClose } = useModalWithHubPreview({
    onAssign,
    onClose,
  });

  return (
    <LookupModal isOpen={isOpen} onClose={handleModalClose} title={<FormattedMessage id="ld.hubs.assign" />}>
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
          <HubsContent {...hubPreviewProps} />
        </Search.Content>
      </Search>
    </LookupModal>
  );
};
