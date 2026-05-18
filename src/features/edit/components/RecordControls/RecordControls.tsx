import { memo } from 'react';

import { CloseRecord } from '../CloseRecord';
import { SaveRecord } from '../SaveRecord';

import './RecordControls.scss';

export const RecordControls = memo(() => {
  return (
    <div className="record-controls">
      <CloseRecord />
      <SaveRecord primary />
      <SaveRecord />
    </div>
  );
});
