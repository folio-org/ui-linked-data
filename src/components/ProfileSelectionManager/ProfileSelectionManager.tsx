import { QueryParams, ROUTES } from '@common/constants/routes.constants';
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

    navigateToEditPage(
      `${ROUTES.RESOURCE_CREATE.uri}?${QueryParams.Type}=${queryParams?.[QueryParams.Type]}&${QueryParams.Ref}=${queryParams?.[QueryParams.Ref]}&${QueryParams.ProfileId}=${profileId}`,
    );
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
