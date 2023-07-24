import { FC } from 'react';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { useModalControls } from '@common/hooks/useModalControls';

const CloseRecord: FC = () => {
  const { saveRecord, discardRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();

  return (
    <>
      <button onClick={openModal}>Close Record</button>
      <ModalCloseRecord
        isOpen={isModalOpen}
        toggleIsOpen={setIsModalOpen}
        saveRecord={saveRecord}
        discardRecord={discardRecord}
      />
    </>
  );
};

export default CloseRecord;
