import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';

interface ModalWarningProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export const ModalWarning: FC<ModalWarningProps> = ({ isOpen, onClose }) => {
  const { formatMessage } = useIntl();

  return (
    <Modal
      className="modal-profile-warning"
      isOpen={isOpen}
      title={''}
      submitButtonLabel={formatMessage({ id: 'ld.ok' })}
      onClose={onClose}
      cancelButtonHidden={true}
      submitButtonHidden={true}
    >
      <div>
        <p>
          <FormattedMessage id="ld.modal.chooseProfileWarning.message" />
        </p>
      </div>
    </Modal>
  );
};
