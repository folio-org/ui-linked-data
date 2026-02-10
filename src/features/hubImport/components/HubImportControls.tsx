import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Button, ButtonType } from '@/components/Button';

import { DEFAULT_HUB_SOURCE } from '../constants/hubSources.constants';
import { useHubImportMutation } from '../hooks';

import './HubImportControls.scss';

export const HubImportControls = () => {
  const { importHubForEdit } = useHubImportMutation();
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const { hubId } = useParams<{ hubId: string }>();
  const [searchParams] = useSearchParams();
  const source = searchParams.get(QueryParams.Source) ?? DEFAULT_HUB_SOURCE;

  const handleContinue = () => {
    if (hubId) {
      importHubForEdit(hubId, source);
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
