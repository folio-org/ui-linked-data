import { memo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import state from '@state';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { ModalCloseRecord } from '../ModalCloseRecord';
import { ModalDeleteRecord } from '../ModalDeleteRecord';
import './RecordControls.scss';

export const RecordControls = memo(() => {
  const record = useRecoilValue(state.inputs.record);
  const { saveRecord, deleteRecord, discardRecord } = useRecordControls();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isDisabled = !record || record?.id === DEFAULT_RECORD_ID;

  const onClickCloseButton = () => {
    setIsCloseModalOpen(true);
  };

  const onClickDeleteButton = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <div>
        <button onClick={saveRecord}>Save Record</button>
        <button onClick={onClickCloseButton}>Close Record</button>
        <button onClick={onClickDeleteButton} disabled={isDisabled}>
          Delete Record
        </button>
      </div>
      <ModalCloseRecord
        isOpen={isCloseModalOpen}
        toggleIsOpen={setIsCloseModalOpen}
        saveRecord={saveRecord}
        discardRecord={discardRecord}
      />
      <ModalDeleteRecord isOpen={isDeleteModalOpen} toggleIsOpen={setIsDeleteModalOpen} deleteRecord={deleteRecord} />
    </div>
  );
});
