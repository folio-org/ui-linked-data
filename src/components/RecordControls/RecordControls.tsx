import { memo } from 'react';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import { DeleteRecord } from '@components/DeleteRecord';
import './RecordControls.scss';
import { useRecoilValue } from 'recoil';
import state from '@state';

export const RecordControls = memo(() => {
  const isEditSectionOpen = useRecoilValue(state.ui.isEditSectionOpen);

  return isEditSectionOpen ? (
    <>
      <SaveRecord />
      <CloseRecord />
      <DeleteRecord />
    </>
  ) : null;
});
