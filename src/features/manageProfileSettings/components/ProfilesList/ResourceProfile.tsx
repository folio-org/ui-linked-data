import { FC } from 'react';

import classNames from 'classnames';

import { Button, ButtonType } from '@/components/Button';

import { useManageProfileSettingsState, useUIState } from '@/store';

type ResourceProfileProps = {
  profile: ProfileDTO;
  selected: boolean;
};

export const ResourceProfile: FC<ResourceProfileProps> = ({ profile, selected }) => {
  const { setNextSelectedProfile, setSelectedProfile, isModified } = useManageProfileSettingsState([
    'setNextSelectedProfile',
    'setSelectedProfile',
    'isModified',
  ]);
  const { setIsManageProfileSettingsUnsavedModalOpen } = useUIState(['setIsManageProfileSettingsUnsavedModalOpen']);

  const handleClick = () => {
    if (isModified) {
      setNextSelectedProfile(profile);
      setIsManageProfileSettingsUnsavedModalOpen(true);
    } else {
      setSelectedProfile(profile);
    }
  };

  return (
    <div className={classNames('profile', selected ? 'selected' : '')}>
      <Button type={ButtonType.ListItem} onClick={handleClick} label={profile.name} disabled={selected} />
    </div>
  );
};
