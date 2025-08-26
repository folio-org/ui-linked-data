import { useEffect, useState } from 'react';
import { setPreferredProfile } from '@common/api/profiles.api';
import { ROUTES } from '@common/constants/routes.constants';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { getRecordProfileId } from '@common/helpers/record.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useInputsState, useNavigationState, useProfileState, useUIState } from '@src/store';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen, profileSelectionType } = useUIState();
  const { record } = useInputsState();
  const { availableProfiles } = useProfileState();
  const { queryParams } = useNavigationState();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { changeRecordProfile } = useRecordControls();
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null | undefined>(null);
  const { action, resourceTypeURL } = profileSelectionType;

  const onClose = () => {
    setIsProfileSelectionModalOpen(false);
    setSelectedProfileId(null);
  };

  const onSubmit = async (profileId: string | number, isDefault?: boolean) => {
    if (isDefault) {
      await setPreferredProfile(profileId, resourceTypeURL);
    }

    if (action === 'set') {
      onClose();

      const url = generatePageURL({ url: ROUTES.RESOURCE_CREATE.uri, queryParams, profileId });
      navigateToEditPage(url);
    } else {
      await changeRecordProfile({ profileId });

      onClose();
    }
  };

  useEffect(() => {
    if (!isProfileSelectionModalOpen) return;

    const updatedSelectedProfileId = action === 'change' ? getRecordProfileId(record) : null;
    setSelectedProfileId(updatedSelectedProfileId);
  }, [isProfileSelectionModalOpen, action, record]);

  return isProfileSelectionModalOpen ? (
    <ModalChooseProfile
      isOpen={isProfileSelectionModalOpen}
      profileSelectionType={profileSelectionType}
      onCancel={onClose}
      onSubmit={onSubmit}
      onClose={onClose}
      profiles={resourceTypeURL ? availableProfiles?.[resourceTypeURL] : []}
      selectedProfileId={selectedProfileId}
    />
  ) : null;
};
