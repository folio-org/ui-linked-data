import { FC, memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import './ModalDeleteRecord.scss';

interface Props {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  deleteRecord: () => Promise<void>;
}

export const ModalDeleteRecord: FC<Props> = memo(({ isOpen, toggleIsOpen, deleteRecord }) => {
  const { formatMessage } = useIntl();

  const closeModal = () => {
    toggleIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'marva.deleteRd' })}
      submitButtonLabel={formatMessage({ id: 'marva.delete' })}
      cancelButtonLabel={formatMessage({ id: 'marva.return' })}
      onClose={closeModal}
      onSubmit={deleteRecord}
      onCancel={closeModal}
    >
      <div className="delete-record-contents" data-testid="modal-delete-record-content">
        <FormattedMessage id="marva.confirmDeleteRd" />
      </div>
    </Modal>
  );
});
