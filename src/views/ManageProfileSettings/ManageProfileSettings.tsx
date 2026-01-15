import { ProfilesList } from '@/components/ProfilesList';
import { ProfileSettings } from '@/components/ProfileSettings';
import { ModalCloseProfileSettings } from '@/components/ModalCloseProfileSettings';
import './ManageProfileSettings.scss';

export const ManageProfileSettings = () => {
  return (
    <>
      <div className="manage-profile-settings">
        <ProfilesList />
        <ProfileSettings />
      </div>
      <ModalCloseProfileSettings />
    </>
  );
};
