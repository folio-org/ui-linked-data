import { memo } from 'react';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import './RecordControls.scss';

export const RecordControls = memo(() => (
  <div className="record-controls">
    <CloseRecord />
    <SaveRecord primary />
    <SaveRecord />
  </div>
));
