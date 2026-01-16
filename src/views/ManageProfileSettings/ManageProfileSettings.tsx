import { ProfilesList } from '@/components/ProfilesList';
import { ProfileSettings } from '@/components/ProfileSettings';
import { ModalCloseProfileSettings } from '@/components/ModalCloseProfileSettings';
import './ManageProfileSettings.scss';
//TODO: add ModalSaveUnusedProfileFields

export const ManageProfileSettings = () => {
  return (
    <>
      <div
        data-testid="manage-profile-settings"
        className="manage-profile-settings"
      >
        <ProfilesList />
        <ProfileSettings />
      </div>
      <ModalCloseProfileSettings />
    </>
  );
};
