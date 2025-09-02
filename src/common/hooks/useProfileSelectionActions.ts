import { StatusType } from '@common/constants/status.constants';
import { ROUTES } from '@common/constants/routes.constants';
import { savePreferredProfile } from '@common/api/profiles.api';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useNavigationState, useStatusState } from '@src/store';

interface UseProfileSelectionActionsProps {
  resourceTypeURL?: string;
  action: string;
  resetModalState: () => void;
}

export const useProfileSelectionActions = ({
  resourceTypeURL,
  action,
  resetModalState,
}: UseProfileSelectionActionsProps) => {
  const { queryParams } = useNavigationState();
  const { addStatusMessagesItem } = useStatusState();
  const { setIsLoading } = useLoadingState();
  const { navigateToEditPage } = useNavigateToEditPage();
  const { changeRecordProfile } = useRecordControls();

  const handleSetProfileAsDefault = async (profileId: string | number) => {
    if (!resourceTypeURL) return;

    try {
      setIsLoading(true);
      await savePreferredProfile(profileId, resourceTypeURL);
    } catch (error) {
      console.error('Failed to set preferred profile:', error);

      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.error.profileSaveAsPreferred'),
      );
    } finally {
      setIsLoading(false);
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

  return {
    handleSubmit,
  };
};
