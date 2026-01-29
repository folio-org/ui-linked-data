import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useManageProfileSettingsState, useLoadingState, useStatusState } from '@/store';
import { getProfileLabelId, getResourceTypeFromURL } from '@/configs/resourceTypes';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { StatusType } from '@/common/constants/status.constants';
import { useLoadProfile } from '@/common/hooks/useLoadProfile';
import { useLoadProfileSettings } from '@/common/hooks/useLoadProfileSettings';
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
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

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

  return selectedProfile ? (
    <div data-testid="profile-settings" className="profile-settings">
      <div className="nav">
        <div className="nav-block nav-block-fixed-height">
          <div className="heading">
            <FormattedMessage
              id={getProfileLabelId(getResourceTypeFromURL(selectedProfile.resourceType as ResourceTypeURL))}
            />
            : {selectedProfile.name}
          </div>
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
