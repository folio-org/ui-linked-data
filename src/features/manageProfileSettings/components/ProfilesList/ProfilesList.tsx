import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { RESOURCE_TYPE_REGISTRY, getProfileLabelId, getUri } from '@/configs/resourceTypes';

import { useProfileList } from '@/features/manageProfileSettings/hooks/useProfileList';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState, useUIState } from '@/store';

import { ResourceProfiles } from './ResourceProfiles';

import './ProfilesList.scss';

export const ProfilesList = () => {
  const { loadAllAvailableProfiles } = useProfileList();
  const { setIsLoading } = useLoadingState();
  const { availableProfiles } = useProfileState(['availableProfiles']);
  const { selectedProfile, setSelectedProfile } = useManageProfileSettingsState([
    'selectedProfile',
    'setSelectedProfile',
  ]);
  const {
    isManageProfileSettingsBelowBreakpoint,
    isManageProfileSettingsShowProfiles,
    isManageProfileSettingsShowEditor,
  } = useUIState([
    'isManageProfileSettingsBelowBreakpoint',
    'isManageProfileSettingsShowProfiles',
    'isManageProfileSettingsShowEditor',
  ]);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await loadAllAvailableProfiles();
      } catch {
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingProfiles'));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (
      !isManageProfileSettingsBelowBreakpoint &&
      isManageProfileSettingsShowEditor &&
      availableProfiles &&
      !selectedProfile &&
      Object.keys(availableProfiles).length > 0
    ) {
      for (const resourceType in availableProfiles) {
        if (availableProfiles[resourceType as ResourceTypeURL]?.length > 0) {
          setSelectedProfile(availableProfiles[resourceType as ResourceTypeURL][0]);
          break;
        }
      }
    }
  }, [availableProfiles]);

  const showView =
    !isManageProfileSettingsBelowBreakpoint ||
    (isManageProfileSettingsBelowBreakpoint && isManageProfileSettingsShowProfiles);
  return availableProfiles ? (
    <div data-testid="profiles-list" className={classNames('profiles-list', showView ? '' : 'hidden')}>
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          <h3 className="heading">
            <FormattedMessage id="ld.profiles" />
          </h3>
          <span className="empty-block" />
        </div>
      </div>
      <div className="profiles">
        {Object.keys(RESOURCE_TYPE_REGISTRY).map(type => {
          return (
            <ResourceProfiles
              key={type}
              labelId={getProfileLabelId(type)}
              profiles={availableProfiles[getUri(type) as ResourceTypeURL]}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};
