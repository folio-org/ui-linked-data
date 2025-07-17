import { ROUTES } from '@common/constants/routes.constants';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useNavigationState, useProfileState, useUIState } from '@src/store';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen } = useUIState();
  const { availableProfiles } = useProfileState();
  const { queryParams } = useNavigationState();
  const { navigateToEditPage } = useNavigateToEditPage();

  const onClose = () => {
    setIsProfileSelectionModalOpen(false);
  };

  const onSubmit = (profileId: string) => {
    onClose();

    const url = generatePageURL({ url: ROUTES.RESOURCE_CREATE.uri, queryParams, profileId });

    navigateToEditPage(url);
  };

  return (
    <ModalChooseProfile
      isOpen={isProfileSelectionModalOpen}
      onCancel={onClose}
      onSubmit={onSubmit}
      onClose={onClose}
      profiles={availableProfiles}
    />
  );
};
