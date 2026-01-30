import { FC, memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Modal } from '@/components/Modal';

import './ModalSwitchToNewRecord.scss';

interface Props {
  isOpen: boolean;
  onCancel: VoidFunction;
  onSubmit: VoidFunction;
  onClose: VoidFunction;
}

export const ModalSwitchToNewRecord: FC<Props> = memo(({ isOpen, onCancel, onSubmit, onClose }) => {
  const { formatMessage } = useIntl();

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'ld.unsavedChanges' })}
      submitButtonLabel={formatMessage({ id: 'ld.saveAndContinue' })}
      cancelButtonLabel={formatMessage({ id: 'ld.continueWithoutSaving' })}
      onClose={onClose}
      onSubmit={onSubmit}
      onCancel={onCancel}
      className="modal-switch-to-new-record"
    >
      <div className="close-record-contents" data-testid="modal-close-record-content">
        <FormattedMessage id="ld.unsavedRecentEdits" />
      </div>
    </Modal>
  );
});
