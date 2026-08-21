import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { getRecordTitle } from '@/common/helpers/record.helper';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Button, ButtonType } from '@/components/Button';

import Times16 from '@/assets/times-16.svg?react';

import { useHubQuery } from '../hooks';

export const HubImportNavPane = () => {
  const [searchParams] = useSearchParams();
  const sourceUri = searchParams.get(QueryParams.SourceUri);
  const { data } = useHubQuery({ hubUri: sourceUri ?? undefined, enabled: !!sourceUri });
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const { formatMessage } = useIntl();

  const handleClose = () => {
    navigate(searchResultsUri);
  };

  const closeButtonLabel = formatMessage({ id: 'ld.aria.hubImport.close' });
  const headerLabel = formatMessage({ id: 'ld.importHub.header.title' }, { title: data && getRecordTitle(data) });

  return (
    <div className="nav-block nav-block-fixed-height">
      <nav>
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={handleClose}
          className="nav-close"
          ariaLabel={closeButtonLabel}
        >
          <Times16 />
        </Button>
      </nav>
      <div className="heading">{headerLabel}</div>
      <span className="empty-block" />
    </div>
  );
};
