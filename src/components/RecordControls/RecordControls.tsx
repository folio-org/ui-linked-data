import { memo, useState } from 'react';
import classNames from 'classnames';
import './RecordControls.scss';
import { ModalCloseRecord } from '../ModalCloseRecord/ModalCloseRecord';
import { ModalDeleteRecord } from '../ModalDeleteRecord/ModalDeleteRecord';
import { useRecordControls } from '../../common/hooks/useRecordControls';

export const RecordControls = memo(() => {
  const { status, saveRecord, deleteRecord, discardRecord } = useRecordControls();
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
      {status && <p className={classNames(['status-message', status.type])}>{status.message}</p>}
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
