import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import { DeleteRecord } from '@components/DeleteRecord';
import state from '@state';
import './RecordControls.scss';

export const RecordControls = memo(() => {
  const isEditSectionOpen = useRecoilValue(state.ui.isEditSectionOpen);

  return isEditSectionOpen ? (
    <div className="record-controls">
      <SaveRecord />
      <CloseRecord />
      <DeleteRecord />
    </div>
  ) : null;
});
