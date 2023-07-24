import { memo } from 'react';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import { DeleteRecord } from '@components/DeleteRecord';
import './RecordControls.scss';

export const RecordControls = memo(() => {
  return (
    <>
      <SaveRecord />
      <CloseRecord />
      <DeleteRecord />
    </>
  );
});
