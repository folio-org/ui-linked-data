import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { Button, ButtonType } from '@components/Button';
import state from '@state';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { useSearchParams } from 'react-router-dom';
import { QueryParams } from '@common/constants/routes.constants';

const SaveRecord = ({ primary = false }) => {
  const recordIsEdited = useRecoilValue(state.status.recordIsEdited);
  const { saveRecord } = useRecordControls();
  const { hasBeenSaved } = useRecordStatus();
  const [searchParams] = useSearchParams();

  return (
    <Button
      data-testid={`save-record${primary ? '-and-close' : '-and-keep-editing'}`}
      type={primary ? ButtonType.Primary : ButtonType.Highlighted}
      onClick={() => saveRecord({ isNavigatingBack: primary })}
      disabled={!searchParams.get(QueryParams.CloneOf) && !hasBeenSaved && !recordIsEdited}
    >
      <FormattedMessage id={!primary ? 'ld.saveAndKeepEditing' : 'ld.saveAndClose'} />
    </Button>
  );
};

export default memo(SaveRecord);
