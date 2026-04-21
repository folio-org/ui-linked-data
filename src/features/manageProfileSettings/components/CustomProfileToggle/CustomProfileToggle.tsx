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
      <label htmlFor="settings-active-default">
        <input
          id="settings-active-default"
          data-testid="settings-active-default"
          name="settings-active"
          type="radio"
          checked={!isSettingsActive}
          onChange={() => handleToggle(false)}
        />
        <FormattedMessage id="ld.profileDefault" />
      </label>
      <span className="empty-block" />
      <label htmlFor="settings-active-custom">
        <input
          id="settings-active-custom"
          data-testid="settings-active-custom"
          name="settings-active"
          type="radio"
          checked={isSettingsActive}
          onChange={() => handleToggle(true)}
        />
        <FormattedMessage id="ld.custom" />
      </label>
    </div>
  );
};
