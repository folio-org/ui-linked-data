import { useUIState } from '@/store';
import { ProfilesList } from '@/features/manageProfileSettings/components/ProfilesList';
import { ProfileSettings } from '@/features/manageProfileSettings/components/ProfileSettings';
import { ModalCloseProfileSettings } from '@/features/manageProfileSettings/components/ModalCloseProfileSettings';
import './ManageProfileSettings.scss';
//TODO: add ModalSaveUnusedProfileFields

export const ManageProfileSettings = () => {
  const { isManageProfileSettingsUnsavedModalOpen, setIsManageProfileSettingsUnsavedModalOpen } = useUIState([
    'isManageProfileSettingsUnsavedModalOpen',
    'setIsManageProfileSettingsUnsavedModalOpen',
  ]);

  return (
    <>
      <div data-testid="manage-profile-settings" className="manage-profile-settings">
        <ProfilesList />
        <ProfileSettings />
      </div>
      <ModalCloseProfileSettings
        isOpen={isManageProfileSettingsUnsavedModalOpen}
        setIsOpen={setIsManageProfileSettingsUnsavedModalOpen}
      />
    </>
  );
};
