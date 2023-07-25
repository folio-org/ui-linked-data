import { FC, memo } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';

const SaveRecord: FC = () => {
  const { saveRecord } = useRecordControls();

  return (
    <button data-testid="save-record-button" onClick={saveRecord}>
      Save Record
    </button>
  );
};

export default memo(SaveRecord);
