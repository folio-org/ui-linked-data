import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { Button, ButtonType } from '@/components/Button';
import { getProfileLabelId, getResourceTypeFromURL } from '@/configs/resourceTypes';

import { useLoadProfile, useLoadProfileSettings } from '@/features/profiles';

import { useLoadingState, useManageProfileSettingsState, useStatusState, useUIState } from '@/store';

import ArrowLeftIcon from '@/assets/arrow-left-16.svg?react';

import { CustomProfileToggle } from '../CustomProfileToggle';
import { DefaultProfileOption } from '../DefaultProfileOption';
import { ProfileSettingsEditor } from '../ProfileSettingsEditor';
import { ProfileSettingsList } from '../ProfileSettingsList';

import './ProfileSettings.scss';

export const ProfileSettings = () => {
  const { setIsLoading } = useLoadingState();
  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();
  const { selectedProfile, selectedProfileSettingsMeta, setFullProfile, setProfileSettings, resetProfileSettings } =
    useManageProfileSettingsState([
      'selectedProfile',
      'selectedProfileSettingsMeta',
      'setFullProfile',
      'setProfileSettings',
      'resetProfileSettings',
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
          if (selectedProfileSettingsMeta) {
            if (selectedProfileSettingsMeta.id === 'default') {
              resetProfileSettings();
            } else {
              setProfileSettings(
                await loadProfileSettings(
                  selectedProfileSettingsMeta.id,
                  String(selectedProfile.id),
                  profile,
                  selectedProfile.resourceType,
                ),
              );
            }
          }
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
  }, [selectedProfile, selectedProfileSettingsMeta]);

  const showView =
    !isManageProfileSettingsBelowBreakpoint ||
    (isManageProfileSettingsBelowBreakpoint && isManageProfileSettingsShowEditor);
  return selectedProfile ? (
    <div data-testid="profile-settings" className={classNames('profile-settings', showView ? '' : 'hidden')}>
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          {isManageProfileSettingsBelowBreakpoint && (
            <Button data-testid="back-to-profiles-list" type={ButtonType.Icon} onClick={handleBack}>
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

      <ProfileSettingsList />

      <CustomProfileToggle />

      <ProfileSettingsEditor />
    </div>
  ) : (
    ''
  );
};
