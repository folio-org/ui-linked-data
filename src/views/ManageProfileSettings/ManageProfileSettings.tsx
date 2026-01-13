import { useState } from "react";
import { ProfilesList } from "@/components/ProfilesList";
import { ProfileSettings } from "@/components/ProfileSettings";
import './ManageProfileSettings.scss';

export const ManageProfileSettings = () => {
  const [ selectedProfile, setSelectedProfile ] = useState<ProfileDTO>();

  return (
    <div className="manage-profile-settings">
      <ProfilesList
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile} />
      <ProfileSettings
        selectedProfile={selectedProfile} />
    </div>
  );
};
