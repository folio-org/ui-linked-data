import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { useManageProfileSettingsState } from "@/store";
import { BibframeEntitiesMap } from "@/common/constants/bibframe.constants";
import './ProfileSettings.scss';

type ProfileSettingsProps = {
  selectedProfile: ProfileDTO | undefined;
};

export const ProfileSettings: FC<ProfileSettingsProps> = ({
  selectedProfile,
}) => {
  const { 
    profileSettings,
    setProfileSettings,
    isTypeDefaultProfile,
    setIsTypeDefaultProfile,
   } = useManageProfileSettingsState([
    "profileSettings",
    "setProfileSettings",
    "isTypeDefaultProfile",
    "setIsTypeDefaultProfile",
  ]);
  
  return selectedProfile ? (
    <div className="profile-settings">
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          <div className="heading">
            <FormattedMessage
              id={'ld.' + BibframeEntitiesMap[selectedProfile.resourceType as keyof typeof BibframeEntitiesMap]}/>
              : {selectedProfile.name}
          </div>
          <span className="empty-block" />
        </div>
      </div>

      <div className="default-settings">
        <input type="checkbox" checked={isTypeDefaultProfile} />
        <div>&nbsp;
          Set as my default&nbsp;
          <FormattedMessage
            id={'ld.' + BibframeEntitiesMap[selectedProfile.resourceType as keyof typeof BibframeEntitiesMap]}/>
          &nbsp;profile
        </div>
      </div>

      <hr />

      <div className="settings-option">
        <input type="radio" checked={!profileSettings.active} />
        <div>&nbsp;Profile default</div>

        <input type="radio" checked={profileSettings.active} />
        <div>&nbsp;Custom</div>
      </div>

    </div>
  ) : '';
};
