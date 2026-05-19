import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { RESOURCE_TEMPLATE_IDS } from '@/common/constants/bibframe.constants';
import { RecordStatus } from '@/common/constants/record.constants';
import { RESOURCE_CREATE_URLS } from '@/common/constants/routes.constants';
import { getEditActionPrefix } from '@/common/helpers/bibframe.helper';
import { useBackToSearchUri } from '@/common/hooks/useBackToSearchUri';
import { useRoutePathPattern } from '@/common/hooks/useRoutePathPattern';
import { Button, ButtonType } from '@/components/Button';

import { useLoadingState, useStatusState, useUIState } from '@/store';

import Times16 from '@/assets/times-16.svg?react';

import './EditControlPane.scss';

export const EditControlPane = () => {
  const isInCreateMode = useRoutePathPattern(RESOURCE_CREATE_URLS);
  const { isLoading } = useLoadingState(['isLoading']);
  const { currentlyEditedEntityBfid } = useUIState(['currentlyEditedEntityBfid']);
  const { setRecordStatus } = useStatusState(['setRecordStatus']);
  const navigate = useNavigate();
  const searchResultsUri = useBackToSearchUri();
  const [queryParams] = useSearchParams();
  const { formatMessage } = useIntl();

  return (
    <div className="nav-block nav-block-fixed-height">
      <nav>
        <Button
          data-testid="nav-close-button"
          type={ButtonType.Icon}
          onClick={() => {
            setRecordStatus({ type: RecordStatus.saveAndClose });
            navigate(searchResultsUri);
          }}
          className="nav-close"
          ariaLabel={formatMessage({ id: 'ld.aria.edit.close' })}
        >
          <Times16 />
        </Button>
      </nav>
      <h2 className="heading">
        {!isLoading &&
          Array.from(currentlyEditedEntityBfid).map(bfid => (
            <FormattedMessage
              key={bfid}
              id={`ld.${getEditActionPrefix(isInCreateMode, queryParams)}${RESOURCE_TEMPLATE_IDS[bfid]}`}
            />
          ))}
      </h2>
      <span className="empty-block" />
    </div>
  );
};
