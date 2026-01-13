import { FC } from "react";
import classNames from "classnames";
import { Button, ButtonType } from "../Button";

type ResourceProfileProps = {
  profile: ProfileDTO;
  selected: boolean;
  setSelectedProfile: (profile: ProfileDTO) => void;
};

export const ResourceProfile: FC<ResourceProfileProps> = ({
  profile,
  selected,
  setSelectedProfile,
}) => {
  return (
    <div className={classNames('profile', selected ? 'selected' : '')}>
      <Button
        type={ButtonType.Link}
        onClick={() => { setSelectedProfile(profile)}}
        label={profile.name}/>
    </div>
  ); 
};
