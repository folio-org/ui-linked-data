import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import state from '@state';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalDeleteRecord } from '@components/ModalDeleteRecord';
import { useModalControls } from '@common/hooks/useModalControls';

const DeleteRecord: FC = () => {
  const record = useRecoilValue(state.inputs.record);
  const { deleteRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const isDisabled = !record || record?.id === DEFAULT_RECORD_ID;

  return (
    <>
      <button onClick={openModal} disabled={isDisabled}>
        Delete Record
      </button>
      <ModalDeleteRecord isOpen={isModalOpen} toggleIsOpen={setIsModalOpen} deleteRecord={deleteRecord} />
    </>
  );
};

export default DeleteRecord;
