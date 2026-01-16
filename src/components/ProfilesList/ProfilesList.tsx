import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import { useManageProfileSettingsState, useProfileState } from '@src/store';
import { useProfileList } from '@/common/hooks/useProfileList';
import { ResourceProfiles } from './ResourceProfiles';
import './ProfilesList.scss';

export const ProfilesList = () => {
  const { loadAllAvailableProfiles } = useProfileList();
  const { availableProfiles } = useProfileState(['availableProfiles']);
  const { selectedProfile, setSelectedProfile } = useManageProfileSettingsState([
    'selectedProfile',
    'setSelectedProfile',
  ]);

  useEffect(() => {
    loadAllAvailableProfiles();
  }, [loadAllAvailableProfiles]);

  useEffect(() => {
    if (availableProfiles && !selectedProfile && Object.keys(availableProfiles).length > 0) {
      for (const resourceType in availableProfiles) {
        if (availableProfiles[resourceType as ResourceTypeURL] && availableProfiles[resourceType as ResourceTypeURL].length > 0) {
          setSelectedProfile(availableProfiles[resourceType as ResourceTypeURL][0]);
          break;
        }
      }
    }
  }, [availableProfiles]);

  return availableProfiles ? (
    <div data-testid="profiles-list" className="profiles-list">
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          <div className="heading">
            <FormattedMessage id="ld.profiles" />
          </div>
          <span className="empty-block" />
        </div>
      </div>
      <div className="profiles">
        {Object.keys(BibframeEntitiesMap).map(type => {
          return (
            <ResourceProfiles
              key={type}
              labelId={BibframeEntitiesMap[type as ResourceTypeURL]}
              profiles={availableProfiles[type as ResourceTypeURL]}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};
