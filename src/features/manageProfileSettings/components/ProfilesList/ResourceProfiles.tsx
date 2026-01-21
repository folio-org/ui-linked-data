import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { ResourceProfile } from './ResourceProfile';
import { useManageProfileSettingsState } from '@/store';

type ResourceProfilesProps = {
  labelId: string;
  profiles: ProfileDTO[];
};

export const ResourceProfiles: FC<ResourceProfilesProps> = ({ labelId, profiles }) => {
  const { selectedProfile } = useManageProfileSettingsState(['selectedProfile']);

  const isSelectedProfile = (id: number) => {
    return selectedProfile?.id === id;
  };

  return (
    <>
      <div className="resource-title">
        <FormattedMessage id={'ld.' + labelId} />
        &nbsp;
        <FormattedMessage id="ld.profiles" />
      </div>
      {profiles?.map(profile => {
        return (
          <ResourceProfile key={profile.id} profile={profile} selected={isSelectedProfile(profile.id as number)} />
        );
      })}
    </>
  );
};
