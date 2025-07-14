import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useProfileState, useUIState } from '@src/store';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen } = useUIState();
  const { profilesMetadata } = useProfileState();

  console.log('====================================');
  console.log('profilesMetadata', profilesMetadata);
  console.log('====================================');

  const onSubmit = () => {};

  const onClose = () => {
    setIsProfileSelectionModalOpen(false);
  };

  return (
    <ModalChooseProfile
      isOpen={isProfileSelectionModalOpen}
      onCancel={onClose}
      onSubmit={onSubmit}
      onClose={onClose}
      profiles={profilesMetadata}
      onSelectProfile={() => {}}
    />
  );
};
