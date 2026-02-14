import { FormattedMessage } from 'react-intl';

import { useManageProfileSettingsState } from '@/store';

import './CustomProfileToggle.scss';

export const CustomProfileToggle = () => {
  const { isSettingsActive, setIsSettingsActive, setIsModified } = useManageProfileSettingsState([
    'isSettingsActive',
    'setIsSettingsActive',
    'setIsModified',
  ]);

  const handleToggle = (active: boolean) => {
    setIsModified(true);
    setIsSettingsActive(active);
  };

  return (
    <div className="settings-option">
      <input
        id="settings-active-default"
        data-testid="settings-active-default"
        name="settings-active"
        type="radio"
        checked={!isSettingsActive}
        onChange={() => handleToggle(false)}
      />
      <label htmlFor="settings-active-default">
        <FormattedMessage id="ld.profileDefault" />
      </label>
      <span className="empty-block" />
      <input
        id="settings-active-custom"
        data-testid="settings-active-custom"
        name="settings-active"
        type="radio"
        checked={isSettingsActive}
        onChange={() => handleToggle(true)}
      />
      <label htmlFor="settings-active-custom">
        <FormattedMessage id="ld.custom" />
      </label>
    </div>
  );
};
