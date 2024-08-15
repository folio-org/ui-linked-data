import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { Button, ButtonType } from '@components/Button';
import state from '@state';

const SaveRecord = ({ primary = false }) => {
  const { saveRecord } = useRecordControls();
  const isInitiallyLoaded = useRecoilValue(state.status.recordIsInitiallyLoaded);
  const recordIsEdited = useRecoilValue(state.status.recordIsEdited);

  return (
    <Button
      data-testid={`save-record${primary ? '-and-close' : '-and-keep-editing'}`}
      type={primary ? ButtonType.Primary : ButtonType.Highlighted}
      onClick={() => saveRecord({ isNavigatingBack: primary })}
      disabled={isInitiallyLoaded && !recordIsEdited}
    >
      <FormattedMessage id={!primary ? 'marva.saveAndKeepEditing' : 'marva.saveAndClose'} />
    </Button>
  );
};

export default memo(SaveRecord);
