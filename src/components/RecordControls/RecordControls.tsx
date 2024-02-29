import { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import state from '@state';
import './RecordControls.scss';

export const RecordControls = memo(() => {
  const isEditSectionOpen = useRecoilValue(state.ui.isEditSectionOpen);

  return isEditSectionOpen ? (
    <div className="record-controls">
      <CloseRecord />
      <SaveRecord locally />
      <SaveRecord />
    </div>
  ) : null;
});
