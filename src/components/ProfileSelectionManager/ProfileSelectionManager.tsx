import { ROUTES } from '@common/constants/routes.constants';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useNavigationState, useProfileState, useUIState } from '@src/store';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen, profileSelectionType } = useUIState();
  const { availableProfiles } = useProfileState();
  const { queryParams } = useNavigationState();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { saveRecord } = useRecordControls();

  const onClose = () => {
    setIsProfileSelectionModalOpen(false);
  };

  const onSubmit = (profileId: string) => {
    onClose();

    if (profileSelectionType.action === 'set') {
      const url = generatePageURL({ url: ROUTES.RESOURCE_CREATE.uri, queryParams, profileId });

      navigateToEditPage(url);
    } else {
      saveRecord({ isNavigatingBack: false, profileId });
    }
  };

  return (
    <ModalChooseProfile
      isOpen={isProfileSelectionModalOpen}
      profileSelectionType={profileSelectionType}
      onCancel={onClose}
      onSubmit={onSubmit}
      onClose={onClose}
      profiles={availableProfiles?.[profileSelectionType?.resourceType]}
    />
  );
};
