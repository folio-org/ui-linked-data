import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useProfileSelectionActions } from '@common/hooks/useProfileSelectionActions';
import { useProfileSelectionState } from '@common/hooks/useProfileSelectionState';
import { useProfileState, useUIState } from '@src/store';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen, profileSelectionType } = useUIState();
  const { availableProfiles } = useProfileState();
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

  return (
    <ModalChooseProfile
      isOpen={isProfileSelectionModalOpen}
      profileSelectionType={profileSelectionType}
      onCancel={resetModalState}
      onSubmit={handleSubmit}
      onClose={resetModalState}
      profiles={availableProfilesList}
      selectedProfileId={selectedProfileId}
    />
  );
};
