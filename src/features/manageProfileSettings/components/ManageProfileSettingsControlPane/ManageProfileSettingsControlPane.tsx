import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/common/constants/routes.constants';
import { Button, ButtonType } from '@/components/Button';

import { useManageProfileSettingsState, useUIState } from '@/store';

import Times16 from '@/assets/times-16.svg?react';

import './ManageProfileSettingsControlPane.scss';

export const ManageProfileSettingsControlPane = () => {
  const { formatMessage } = useIntl();
  const { setIsManageProfileSettingsUnsavedModalOpen } = useUIState(['setIsManageProfileSettingsUnsavedModalOpen']);
  const { isModified, setIsClosingNext } = useManageProfileSettingsState(['isModified', 'setIsClosingNext']);
  const navigate = useNavigate();

  const handleClose = () => {
    if (isModified) {
      setIsClosingNext(true);
      setIsManageProfileSettingsUnsavedModalOpen(true);
    } else {
      navigate(ROUTES.SEARCH.uri);
    }
  };

  return (
    <div data-testid="manage-profile-settings-control-pane" className="nav-block nav-block-fixed-height">
      <nav>
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={handleClose}
          className="nav-close"
          ariaLabel={formatMessage({ id: 'ld.aria.edit.close' })}
        >
          <Times16 />
        </Button>
      </nav>
      <h2 className="heading">
        <FormattedMessage id="ld.manageProfileSettings" />
      </h2>
      <span className="empty-block" />
    </div>
  );
};
