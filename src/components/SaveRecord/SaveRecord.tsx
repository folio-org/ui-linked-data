import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { Button, ButtonType } from '@components/Button';
import state from '@state';
import { useRecordStatus } from '@common/hooks/useRecordStatus';

const SaveRecord = ({ primary = false }) => {
  const { saveRecord } = useRecordControls();
  const recordIsEdited = useRecoilValue(state.status.recordIsEdited);
  const { hasBeenSaved } = useRecordStatus();
  
  return (
    <Button
      data-testid={`save-record${primary ? '-and-close' : '-and-keep-editing'}`}
      type={primary ? ButtonType.Primary : ButtonType.Highlighted}
      onClick={() => saveRecord({ isNavigatingBack: primary })}
      disabled={!hasBeenSaved && !recordIsEdited}
    >
      <FormattedMessage id={!primary ? 'marva.saveAndKeepEditing' : 'marva.saveAndClose'} />
    </Button>
  );
};

export default memo(SaveRecord);
