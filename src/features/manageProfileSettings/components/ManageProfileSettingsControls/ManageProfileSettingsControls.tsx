import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes.constants';
import { Button, ButtonType } from '@components/Button';
import { useManageProfileSettingsState } from '@/store';
import './ManageProfileSettingsControls.scss';

export const ManageProfileSettingsControls = memo(() => {
  const navigate = useNavigate();
  const { isModified } = useManageProfileSettingsState(['isModified']);

  // placeholders
  const handleButtonClick = () => {};
  const handleButtonClickAndClose = () => {
    navigate(ROUTES.SEARCH.uri);
  };

  return (
    <div className="manage-profile-settings-controls">
      <Button
        data-testid="save-and-close"
        type={ButtonType.Primary}
        onClick={handleButtonClickAndClose}
        disabled={!isModified}
      >
        <FormattedMessage id="ld.saveAndClose" />
      </Button>

      <Button
        data-testid="save-and-keep-editing"
        type={ButtonType.Highlighted}
        onClick={handleButtonClick}
        disabled={!isModified}
      >
        <FormattedMessage id="ld.saveAndKeepEditing" />
      </Button>
    </div>
  );
});
