import { FC, memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '../Modal';

interface Props {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  saveRecord: () => Promise<void>;
  discardRecord: () => void;
}

export const ModalCloseRecord: FC<Props> = memo(({ isOpen, toggleIsOpen, saveRecord, discardRecord }) => {
  const { formatMessage } = useIntl();

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
      title={formatMessage({ id: 'marva.close-record' })}
      submitButtonLabel={formatMessage({ id: 'marva.save-close' })}
      cancelButtonLabel={formatMessage({ id: 'marva.close' })}
      onClose={closeModal}
      onSubmit={onClickSaveAndCloseButton}
      onCancel={discardRecord}
    >
      <div data-testid="modal-close-record-content">
        <FormattedMessage id='marva.confirm-close-record' />
      </div>
    </Modal>
  );
});
