import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { StatusType } from '@/common/constants/status.constants';
import { useLoadProfile } from '@/common/hooks/useLoadProfile';
import { useLoadProfileSettings } from '@/common/hooks/useLoadProfileSettings';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { Button, ButtonType } from '@/components/Button';
import { getProfileLabelId, getResourceTypeFromURL } from '@/configs/resourceTypes';

import { useLoadingState, useManageProfileSettingsState, useStatusState, useUIState } from '@/store';

import ArrowLeftIcon from '@/assets/arrow-left-16.svg?react';

import { CustomProfileToggle } from '../CustomProfileToggle';
import { DefaultProfileOption } from '../DefaultProfileOption';
import { ProfileSettingsEditor } from '../ProfileSettingsEditor';

import './ProfileSettings.scss';

export const ProfileSettings = () => {
  const { setIsLoading } = useLoadingState();
  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();
  const { selectedProfile, setFullProfile, setProfileSettings } = useManageProfileSettingsState([
    'selectedProfile',
    'setFullProfile',
    'setProfileSettings',
  ]);
  const {
    isManageProfileSettingsBelowBreakpoint,
    isManageProfileSettingsShowEditor,
    setIsManageProfileSettingsShowProfiles,
    setIsManageProfileSettingsShowEditor,
  } = useUIState([
    'isManageProfileSettingsBelowBreakpoint',
    'isManageProfileSettingsShowEditor',
    'setIsManageProfileSettingsShowProfiles',
    'setIsManageProfileSettingsShowEditor',
  ]);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const handleBack = () => {
    setIsManageProfileSettingsShowProfiles(true);
    setIsManageProfileSettingsShowEditor(false);
  };

  useEffect(() => {
    if (selectedProfile) {
      const initialize = async () => {
        try {
          setIsLoading(true);
          const profile = await loadProfile(selectedProfile.id);
          setFullProfile(profile);
          setProfileSettings(await loadProfileSettings(selectedProfile.id, profile));
        } catch {
          addStatusMessagesItem?.(
            UserNotificationFactory.createMessage(StatusType.error, 'ld.errorLoadingProfileSettings'),
          );
        } finally {
          setIsLoading(false);
        }
      };

      initialize();
    }
  }, [selectedProfile]);

  const showView =
    !isManageProfileSettingsBelowBreakpoint ||
    (isManageProfileSettingsBelowBreakpoint && isManageProfileSettingsShowEditor);
  return selectedProfile ? (
    <div data-testid="profile-settings" className={classNames('profile-settings', showView ? '' : 'hidden')}>
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          {isManageProfileSettingsBelowBreakpoint && (
            <Button type={ButtonType.Icon} onClick={handleBack}>
              <ArrowLeftIcon />
            </Button>
          )}
          <h3 className="heading">
            <FormattedMessage
              id={getProfileLabelId(getResourceTypeFromURL(selectedProfile.resourceType as ResourceTypeURL))}
            />
            : {selectedProfile.name}
          </h3>
          <span className="empty-block" />
        </div>
      </div>

      <DefaultProfileOption selectedProfile={selectedProfile} />

      <hr />

      <CustomProfileToggle />

      <ProfileSettingsEditor />
    </div>
  ) : (
    ''
  );
};
