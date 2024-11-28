import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { Button, ButtonType } from '@components/Button';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { QueryParams } from '@common/constants/routes.constants';
import { useStoreSelector } from '@common/hooks/useStoreSelectors';

const SaveRecord = ({ primary = false }) => {
  const { isEditedRecord } = useStoreSelector().status;
  const { saveRecord } = useRecordControls();
  const { hasBeenSaved } = useRecordStatus();
  const [searchParams] = useSearchParams();

  return (
    <Button
      data-testid={`save-record${primary ? '-and-close' : '-and-keep-editing'}`}
      type={primary ? ButtonType.Primary : ButtonType.Highlighted}
      onClick={() => saveRecord({ isNavigatingBack: primary })}
      disabled={!searchParams.get(QueryParams.CloneOf) && !hasBeenSaved && !isEditedRecord}
    >
      <FormattedMessage id={!primary ? 'ld.saveAndKeepEditing' : 'ld.saveAndClose'} />
    </Button>
  );
};

export default memo(SaveRecord);
