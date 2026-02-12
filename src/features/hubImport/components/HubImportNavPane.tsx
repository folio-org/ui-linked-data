import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { getRecordTitle } from '@/common/helpers/record.helper';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { Button, ButtonType } from '@/components/Button';

import { useInputsState } from '@/store';

import Times16 from '@/assets/times-16.svg?react';

export const HubImportNavPane = () => {
  const { record } = useInputsState(['record']);
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const { formatMessage } = useIntl();

  const handleClose = () => {
    navigate(searchResultsUri);
  };

  const closeButtonLabel = formatMessage({ id: 'ld.aria.hubImport.close' });
  const headerLabel = formatMessage({ id: 'ld.importHub.header.title' }, { title: record && getRecordTitle(record) });

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
