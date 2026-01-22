import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useProfileSelectionActions } from '@common/hooks/useProfileSelectionActions';
import { useProfileSelectionState } from '@common/hooks/useProfileSelectionState';
import { useProfileState, useStatusState, useUIState } from '@src/store';
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

  const availableProfilesList = resourceTypeURL ? availableProfiles?.[resourceTypeURL] || [] : [];
  const isEditedRecordChange = profileSelectionType.action === 'change' && isRecordEdited;

  if (!isProfileSelectionModalOpen) return null;

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
