import { FC, memo } from 'react';
import { Modal } from '../Modal';

interface Props {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  deleteRecord: () => Promise<void>;
}

export const ModalDeleteRecord: FC<Props> = memo(({ isOpen, toggleIsOpen, deleteRecord }) => {
  const closeModal = () => {
    toggleIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete record"
      submitButtonLabel="Delete"
      cancelButtonLabel="Return"
      onClose={closeModal}
      onSubmit={deleteRecord}
      onCancel={closeModal}
    >
      <div data-testid="modal-delete-record-content">
        <p>Do you really want to delete the record?</p>
      </div>
    </Modal>
  );
});
