import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Button, ButtonType } from '@/components/Button';

import { useHubImportMutation } from '../hooks';

import './HubImportControls.scss';

export const HubImportControls = () => {
  const { importHubForEdit } = useHubImportMutation();
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const [searchParams] = useSearchParams();
  const sourceUri = searchParams.get(QueryParams.SourceUri);

  const handleContinue = () => {
    if (sourceUri) {
      importHubForEdit(sourceUri);
    }
  };

  const handleCancel = () => {
    navigate(searchResultsUri);
  };

  return (
    <div className="hub-import-controls">
      <Button data-testid="cancel-hub-import-button" type={ButtonType.Primary} onClick={handleCancel}>
        <FormattedMessage id="ld.cancel" />
      </Button>
      <Button data-testid="continue-hub-import-button" type={ButtonType.Highlighted} onClick={handleContinue}>
        <FormattedMessage id="ld.continue" />
      </Button>
    </div>
  );
};
