import { memo } from 'react';
import { SaveRecord } from '@components/SaveRecord';
import { CloseRecord } from '@components/CloseRecord';
import { ModalUncontrolledAuthorities } from '@components/ModalUncontrolledAuthorities';
import { useModalControls } from '@common/hooks/useModalControls';
import { useRecordControls } from '@common/hooks/useRecordControls';
import './RecordControls.scss';

export const RecordControls = memo(() => {
  const { saveRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen } = useModalControls();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSaveRecord = (isNavigatingBack: boolean) => {
    const showModal = true;

    if (showModal) {
      setIsModalOpen(true);
    } else {
      saveRecord({ isNavigatingBack });
    }
  };

  return (
    <>
      <div className="record-controls">
        <CloseRecord />
        <SaveRecord onSaveRecord={onSaveRecord} primary />
        <SaveRecord onSaveRecord={onSaveRecord} />
      </div>

      <ModalUncontrolledAuthorities
        isOpen={isModalOpen}
        onCancel={closeModal}
        onContinue={() => {}}
        onClose={closeModal}
      />
    </>
  );
});
