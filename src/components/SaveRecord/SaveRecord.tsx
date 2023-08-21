import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { FormattedMessage } from 'react-intl';

const SaveRecord: FC = () => {
  const { saveRecord } = useRecordControls();

  return (
    <button data-testid="save-record-button" onClick={saveRecord}>
      <FormattedMessage id='marva.save-record' />
    </button>
  );
};

export default memo(SaveRecord);
