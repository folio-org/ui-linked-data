import { Button, ButtonType } from '@components/Button';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import './PreviewExternalResourceControls.scss';

export const PreviewExternalResourceControls = () => {
  const navigate = useNavigate();

  return (
    <div className="preview-external-resource-controls">
      <Button data-testid="close-external-preview-button" type={ButtonType.Primary} onClick={() => navigate(-1)}>
        <FormattedMessage id="ld.cancel" />
      </Button>
      <Button data-testid="continue-external-preview-button" type={ButtonType.Highlighted}>
        <FormattedMessage id="ld.continue" />
      </Button>
    </div>
  );
};
