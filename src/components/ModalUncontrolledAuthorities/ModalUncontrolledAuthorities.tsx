import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@components/Modal';
import './ModalUncontrolledAuthorities.scss';

type ModalUncontrolledAuthoritiesProps = {
  isOpen: boolean;
  onCancel: VoidFunction;
  onContinue: VoidFunction;
  onClose: VoidFunction;
};

export const ModalUncontrolledAuthorities: FC<ModalUncontrolledAuthoritiesProps> = ({
  isOpen,
  onCancel = () => {},
  onContinue = () => {},
  onClose = () => {},
}) => {
  const { formatMessage } = useIntl();

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'ld.modal.uncontrolledAuthoritiesWarning.title' })}
      submitButtonLabel={formatMessage({ id: 'ld.continue' })}
      cancelButtonLabel={formatMessage({ id: 'ld.cancel' })}
      onClose={onClose}
      onSubmit={onContinue}
      onCancel={onCancel}
      className="modal-switch-to-new-record"
    >
      <div className="uncontrolled-authorities-contents" data-testid="modal-uncontrolled-authorities-warning">
        <FormattedMessage id="ld.modal.uncontrolledAuthoritiesWarning.body" />
      </div>
    </Modal>
  );
};
