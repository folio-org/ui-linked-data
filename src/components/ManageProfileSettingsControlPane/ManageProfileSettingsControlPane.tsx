import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes.constants';
import { useUIState, useManageProfileSettingsState } from '@/store';
import { Button, ButtonType } from '@components/Button';
import Times16 from '@src/assets/times-16.svg?react';

export const ManageProfileSettingsControlPane = () => {
  const { formatMessage } = useIntl();
  const { setIsManageProfileSettingsUnsavedModalOpen } = useUIState(['setIsManageProfileSettingsUnsavedModalOpen']);
  const { isModified, setIsClosingNext } = useManageProfileSettingsState(['isModified', 'setIsClosingNext']);
  const navigate = useNavigate();

  const handleClose = () => {
    if (!isModified) {
      navigate(ROUTES.SEARCH.uri);
    } else {
      setIsClosingNext(true);
      setIsManageProfileSettingsUnsavedModalOpen(true);
    }
  };

  return (
    <div className="nav-block nav-block-fixed-height">
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
      <div className="heading">
        <FormattedMessage id="ld.manageProfileSettings" />
      </div>
      <span className="empty-block" />
    </div>
  );
};
