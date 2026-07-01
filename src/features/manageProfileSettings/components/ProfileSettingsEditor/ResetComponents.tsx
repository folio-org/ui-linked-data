import { FormattedMessage } from 'react-intl';

import { Button, ButtonType } from '@/components/Button';

import { useManageProfileSettingsState } from '@/store';

import XInCircle from '@/assets/x-in-circle.svg?react';

export const ResetComponents = () => {
  const { isSettingsActive, resetIsSettingsActive, resetProfileSettings, setIsModified } =
    useManageProfileSettingsState([
      'isSettingsActive',
      'resetIsSettingsActive',
      'resetProfileSettings',
      'setIsModified',
    ]);

  const handleClick = () => {
    resetProfileSettings();
    resetIsSettingsActive();
    setIsModified(true);
  };

  return (
    <div className="reset-components">
      <Button
        data-testid="reset-components"
        type={ButtonType.Text}
        prefix={<XInCircle />}
        label={<FormattedMessage id="ld.profileSettings.resetComponents" />}
        onClick={handleClick}
        disabled={!isSettingsActive}
      />
    </div>
  );
};
