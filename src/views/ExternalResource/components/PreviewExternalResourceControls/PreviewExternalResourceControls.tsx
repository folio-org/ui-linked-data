import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useContainerEvents } from '@/common/hooks/useContainerEvents';
import { Button, ButtonType } from '@/components/Button';

import { useRecordNavigation } from '@/features/resources';

import './PreviewExternalResourceControls.scss';

export const PreviewExternalResourceControls = () => {
  const { tryFetchExternalRecordForEdit } = useRecordNavigation();
  const { dispatchNavigateToOriginEventWithFallback } = useContainerEvents();
  const { externalId } = useParams();

  return (
    <div className="preview-external-resource-controls">
      <Button
        data-testid="close-external-preview-button"
        type={ButtonType.Primary}
        onClick={() => dispatchNavigateToOriginEventWithFallback()}
      >
        <FormattedMessage id="ld.cancel" />
      </Button>
      <Button
        data-testid="continue-external-preview-button"
        type={ButtonType.Highlighted}
        onClick={() => tryFetchExternalRecordForEdit(externalId)}
      >
        <FormattedMessage id="ld.continue" />
      </Button>
    </div>
  );
};
