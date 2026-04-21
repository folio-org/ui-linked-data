import { useProfileSelectionActions } from '@/common/hooks/useProfileSelectionActions';
import { useProfileSelectionState } from '@/common/hooks/useProfileSelectionState';
import { ModalChooseProfile } from '@/components/ModalChooseProfile';

import { useProfileState, useStatusState, useUIState } from '@/store';

import { ModalWarning } from './ModalWarning';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen, profileSelectionType } = useUIState([
    'isProfileSelectionModalOpen',
    'setIsProfileSelectionModalOpen',
    'profileSelectionType',
  ]);
  const { availableProfiles, preferredProfiles } = useProfileState(['availableProfiles', 'preferredProfiles']);
  const { isRecordEdited } = useStatusState(['isRecordEdited']);
  const { action, resourceTypeURL } = profileSelectionType;

  const { selectedProfileId, setSelectedProfileId } = useProfileSelectionState({
    isModalOpen: isProfileSelectionModalOpen,
    action,
  });

  const resetModalState = () => {
    setIsProfileSelectionModalOpen(false);
    setSelectedProfileId(null);
  };

  const { handleSubmit } = useProfileSelectionActions({ resourceTypeURL, action, resetModalState });

  if (!isProfileSelectionModalOpen) return null;

  const availableProfilesList = resourceTypeURL ? availableProfiles?.[resourceTypeURL] || [] : [];
  const isEditedRecordChange = profileSelectionType.action === 'change' && isRecordEdited;

  return (
    <>
      <ModalChooseProfile
        isOpen={isProfileSelectionModalOpen && !isEditedRecordChange}
        profileSelectionType={profileSelectionType}
        onCancel={resetModalState}
        onSubmit={handleSubmit}
        onClose={resetModalState}
        profiles={availableProfilesList}
        selectedProfileId={selectedProfileId}
        preferredProfiles={preferredProfiles}
        resourceTypeURL={resourceTypeURL}
      />
      <ModalWarning isOpen={isProfileSelectionModalOpen && isEditedRecordChange} onClose={resetModalState} />
    </>
  );
};
