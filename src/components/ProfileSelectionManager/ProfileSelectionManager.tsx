import { useEffect, useState } from 'react';
import { setPreferredProfile } from '@common/api/profiles.api';
import { ROUTES } from '@common/constants/routes.constants';
import { StatusType } from '@common/constants/status.constants';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { getRecordProfileId } from '@common/helpers/record.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { ModalChooseProfile } from '@components/ModalChooseProfile';
import { useInputsState, useNavigationState, useProfileState, useStatusState, useUIState } from '@src/store';

export const ProfileSelectionManager = () => {
  const { isProfileSelectionModalOpen, setIsProfileSelectionModalOpen, profileSelectionType } = useUIState();
  const { record } = useInputsState();
  const { availableProfiles } = useProfileState();
  const { queryParams } = useNavigationState();
  const { addStatusMessagesItem } = useStatusState();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { changeRecordProfile } = useRecordControls();
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null | undefined>(null);
  const { action, resourceTypeURL } = profileSelectionType;

  // Update selected profile ID when modal opens or record/action changes
  useEffect(() => {
    if (!isProfileSelectionModalOpen) return;

    const currentProfileId = action === 'change' ? getRecordProfileId(record) : null;
    setSelectedProfileId(currentProfileId);
  }, [isProfileSelectionModalOpen, action, record]);

  const resetModalState = () => {
    setIsProfileSelectionModalOpen(false);
    setSelectedProfileId(null);
  };

  const handleSetProfileAsDefault = async (profileId: string | number) => {
    if (!resourceTypeURL) return;

    try {
      await setPreferredProfile(profileId, resourceTypeURL);
    } catch (error) {
      console.error('Failed to set preferred profile:', error);

      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.error.profileSaveAsPreferred'),
      );
    }
  };

  const handleCreateResource = (profileId: string | number) => {
    const url = generatePageURL({ url: ROUTES.RESOURCE_CREATE.uri, queryParams, profileId });
    navigateToEditPage(url);
  };

  const handleSubmit = async (profileId: string | number, isDefault?: boolean) => {
    // If "set as default" is checked, save preferred profile
    if (isDefault) {
      await handleSetProfileAsDefault(profileId);
    }

    if (action === 'set') {
      resetModalState();
      handleCreateResource(profileId);
    } else {
      try {
        await changeRecordProfile({ profileId });
        resetModalState();
      } catch (error) {
        console.error('Failed to change record profile:', error);

        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.error.profileChange'));
      }
    }
  };

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
