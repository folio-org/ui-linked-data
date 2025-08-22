import { useEffect, useState } from 'react';
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
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null | undefined>();

  const onClose = () => {
    setIsProfileSelectionModalOpen(false);
    setSelectedProfileId(null);
  };

  const onSubmit = async (profileId: string | number) => {
    if (profileSelectionType.action === 'set') {
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

    const updatedSelectedProfileId = profileSelectionType.action === 'change' ? getRecordProfileId(record) : null;
    setSelectedProfileId(updatedSelectedProfileId);
  }, [isProfileSelectionModalOpen, profileSelectionType.action]);

  return isProfileSelectionModalOpen ? (
    <ModalChooseProfile
      isOpen={isProfileSelectionModalOpen}
      profileSelectionType={profileSelectionType}
      onCancel={onClose}
      onSubmit={onSubmit}
      onClose={onClose}
      profiles={availableProfiles?.[profileSelectionType?.resourceType]}
      selectedProfileId={selectedProfileId}
    />
  ) : null;
};
