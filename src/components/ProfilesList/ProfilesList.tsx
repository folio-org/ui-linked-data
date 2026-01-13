import { FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BibframeEntitiesMap, TYPE_URIS } from '@/common/constants/bibframe.constants';
import { useProfileState } from '@src/store';
import { useProfileList } from '@/common/hooks/useProfileList';
import { ResourceProfiles } from './ResourceProfiles';
import './ProfilesList.scss';

type ProfilesListProps = {
  selectedProfile: ProfileDTO | undefined;
  setSelectedProfile: (profile: ProfileDTO) => void;
};

export const ProfilesList: FC<ProfilesListProps> = ({
  selectedProfile,
  setSelectedProfile,
}) => {
  const { loadAllAvailableProfiles } = useProfileList();
  const { availableProfiles } = useProfileState([
    'availableProfiles',
  ]);

  useEffect(() => {
    loadAllAvailableProfiles();
  }, [loadAllAvailableProfiles]);

  useEffect(() => {
    if (availableProfiles && availableProfiles[TYPE_URIS.WORK as ResourceTypeURL] && selectedProfile === undefined) {
      setSelectedProfile(availableProfiles[TYPE_URIS.WORK as ResourceTypeURL][0]);
    }
  }, [availableProfiles]);

  return availableProfiles ? (
    <div className="profiles-list">
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          <div className="heading">
            <FormattedMessage
              id="ld.profiles"
            />
          </div>
          <span className="empty-block" />
        </div>
      </div>
      <div className="profiles">
        {Object.keys(BibframeEntitiesMap).map(type => {
          return <ResourceProfiles
            key={type}
            labelId={BibframeEntitiesMap[type as ResourceTypeURL]}
            profiles={availableProfiles[type as ResourceTypeURL]}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
          />
        })}
      </div>
    </div>
  ) : <></>;
};
