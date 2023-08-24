import { FC, memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '../Modal';

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
      title={formatMessage({ id: 'marva.delete-rd' })}
      submitButtonLabel={formatMessage({ id: 'marva.delete' })}
      cancelButtonLabel={formatMessage({ id: 'marva.return' })}
      onClose={closeModal}
      onSubmit={deleteRecord}
      onCancel={closeModal}
    >
      <div data-testid="modal-delete-record-content">
        <FormattedMessage id="marva.confirm-delete-rd" />
      </div>
    </Modal>
  );
});
