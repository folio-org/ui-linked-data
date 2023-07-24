import { FC } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';

const SaveRecord: FC = () => {
  const { saveRecord } = useRecordControls();

  return <button onClick={saveRecord}>Save Record</button>;
};

export default SaveRecord;
