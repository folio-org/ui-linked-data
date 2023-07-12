import { FC, memo } from 'react';
import { Modal } from '../Modal/Modal';

interface Props {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  deleteRecord: () => Promise<void>;
  discardRecord: () => void;
}

export const ModalDeleteRecord: FC<Props> = memo(({ isOpen, toggleIsOpen, deleteRecord, discardRecord }) => {
  const closeModal = () => {
    toggleIsOpen(false);
  };

  const onClickDeleteButton = async () => {
    await deleteRecord();

    discardRecord();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete record"
      submitButtonLabel="Delete"
      cancelButtonLabel="Return"
      onClose={closeModal}
      onSubmit={onClickDeleteButton}
      onCancel={closeModal}
    >
      <div>
        <p>Do you really want to delete the record?</p>
      </div>
    </Modal>
  );
});
