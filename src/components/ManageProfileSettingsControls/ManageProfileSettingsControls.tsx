import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes.constants';
import { Button, ButtonType } from '@components/Button';
import './ManageProfileSettingsControls.scss';
import { useManageProfileSettingsState } from '@/store';

export const ManageProfileSettingsControls = memo(() => {
  const navigate = useNavigate();
  const { 
    profileSettings,
    isTypeDefaultProfile,
   } = useManageProfileSettingsState([
    "profileSettings",
    "isTypeDefaultProfile",
  ]);

  // placeholders
  const handleButtonClick = () => {};
  const handleButtonClickAndClose = () => {
    navigate(ROUTES.SEARCH.uri);
  };
  const isButtonDisabled = false;

  return (
    <div className="manage-profile-settings-controls">
      <Button
        data-testid='save-and-close'
        type={ButtonType.Primary}
        onClick={handleButtonClickAndClose}
        disabled={isButtonDisabled}
      >
        <FormattedMessage id='ld.saveAndClose' />
      </Button>

      <Button
        data-testid='save-and-keep-editing'
        type={ButtonType.Highlighted}
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
      >
        <FormattedMessage id='ld.saveAndKeepEditing' />
      </Button>
    </div>
  );
});
