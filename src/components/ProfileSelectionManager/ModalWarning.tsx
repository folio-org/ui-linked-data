import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal } from '@/components/Modal';

interface ModalWarningProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export const ModalWarning: FC<ModalWarningProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      className="modal-profile-warning"
      isOpen={isOpen}
      title={<FormattedMessage id="ld.modal.chooseProfileWarning.title" />}
      onClose={onClose}
      cancelButtonHidden={true}
      submitButtonHidden={true}
      data-testid="modal-profile-warning"
    >
      <p>
        <FormattedMessage id="ld.modal.chooseProfileWarning.message" />
      </p>
    </Modal>
  );
};
