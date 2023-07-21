import { FC, memo } from 'react';
import { Modal } from '../Modal';

interface Props {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  saveRecord: () => Promise<void>;
  discardRecord: () => void;
}

export const ModalCloseRecord: FC<Props> = memo(({ isOpen, toggleIsOpen, saveRecord, discardRecord }) => {
  const closeModal = () => {
    toggleIsOpen(false);
  };

  const onClickSaveAndCloseButton = async () => {
    await saveRecord();

    discardRecord();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Close record"
      submitButtonLabel="Save and close"
      cancelButtonLabel="Close"
      onClose={closeModal}
      onSubmit={onClickSaveAndCloseButton}
      onCancel={discardRecord}
    >
      <div>
        <p>Do you really want to close the record? All unsaved changes will be lost.</p>
      </div>
    </Modal>
  );
});
