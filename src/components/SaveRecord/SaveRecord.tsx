import { memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

const SaveRecord = ({ locally = false }) => {
  const { saveRecord, saveLocalRecord } = useRecordControls();

  return (
    <Button
      data-testid={`save-record${locally ? '-locally' : ''}-button`}
      type={locally ? ButtonType.Primary : ButtonType.Highlighted}
      onClick={locally ? saveLocalRecord : saveRecord}
    >
      <FormattedMessage id={locally ? 'marva.saveAndKeepEditing' : 'marva.saveAndClose'} />
    </Button>
  );
};

export default memo(SaveRecord);
