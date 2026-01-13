import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { ResourceProfile } from "./ResourceProfile";

type ResourceProfilesProps = {
  labelId: string;
  profiles: ProfileDTO[];
  selectedProfile: ProfileDTO | undefined;
  setSelectedProfile: (profile: ProfileDTO) => void;
}

export const ResourceProfiles: FC<ResourceProfilesProps> = ({
  labelId,
  profiles,
  selectedProfile,
  setSelectedProfile,
}) => {
  const isSelectedProfile = (id: number) => {
    return selectedProfile !== undefined && selectedProfile.id === id;
  };

  return (
    <>
      <div className="resource-title">
        <FormattedMessage id={'ld.' + labelId} />
        &nbsp;
        <FormattedMessage id="ld.profiles" />
      </div>
      {profiles && profiles.map(profile => {
        return <ResourceProfile
                key={profile.id}
                profile={profile}
                selected={isSelectedProfile(profile.id as number)}
                setSelectedProfile={setSelectedProfile}/>;
      })}
    </>
  );
};
