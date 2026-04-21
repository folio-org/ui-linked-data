import { memo } from 'react';

import { CloseRecord } from '@/components/CloseRecord';
import { SaveRecord } from '@/components/SaveRecord';

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
