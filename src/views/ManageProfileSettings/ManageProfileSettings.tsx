import { useUIState } from '@/store';
import { ProfilesList } from '@/components/ProfilesList';
import { ProfileSettings } from '@/components/ProfileSettings';
import { ModalCloseProfileSettings } from '@/components/ModalCloseProfileSettings';
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
