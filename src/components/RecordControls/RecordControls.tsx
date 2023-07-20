import { memo, useState } from 'react';
import { useRecordControls } from '@hooks/useRecordControls';
import { ModalCloseRecord } from '../ModalCloseRecord';
import { ModalDeleteRecord } from '../ModalDeleteRecord';
import './RecordControls.scss';

export const RecordControls = memo(() => {
  const { saveRecord, deleteRecord, discardRecord } = useRecordControls();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        <button onClick={onClickDeleteButton}>Delete Record</button>
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
