import { useManageProfileSettingsState } from '@/store';
import { FormattedMessage } from 'react-intl';
import './CustomProfileToggle.scss';

export const CustomProfileToggle = () => {
  const { profileSettings, setProfileSettings, setIsModified } = useManageProfileSettingsState([
    'profileSettings',
    'setProfileSettings',
    'setIsModified',
  ]);

  const handleToggle = (active: boolean) => {
    setIsModified(true);
    setProfileSettings(prev => ({ ...prev, active: active }));
  };

  return (
    <div className="settings-option">
      <input
        id="settings-active-default"
        name="settings-active"
        type="radio"
        checked={!profileSettings.active}
        onChange={() => handleToggle(false)}
      />
      <label htmlFor="settings-active-default">
        <FormattedMessage id="ld.profileDefault" />
      </label>
      <span className="empty-block" />
      <input
        id="settings-active-custom"
        name="settings-active"
        type="radio"
        checked={profileSettings.active}
        onChange={() => handleToggle(true)}
      />
      <label htmlFor="settings-active-custom">
        <FormattedMessage id="ld.custom" />
      </label>
    </div>
  );
};
