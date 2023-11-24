import { FC } from 'react';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useModalControls } from '@common/hooks/useModalControls';
import { Modal } from '@components/Modal';

interface Props {
  when: boolean;
}

export const Prompt: FC<Props> = ({ when: shouldPrompt }) => {
  const { formatMessage } = useIntl();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();

  const blocker = useBlocker(() => {
    if (shouldPrompt) {
      openModal();
    }
    return shouldPrompt;
  });

  const stopNavigation = () => {
    setIsModalOpen(false);
    blocker.reset?.();
  };

  const proceedNavigation = () => {
    setIsModalOpen(false);
    blocker.proceed?.();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title={formatMessage({ id: 'marva.close-rd' })}
      cancelButtonLabel={formatMessage({ id: 'marva.yes' })}
      submitButtonLabel={formatMessage({ id: 'marva.no' })}
      onClose={stopNavigation}
      onSubmit={stopNavigation}
      onCancel={proceedNavigation}
    >
      <div data-testid="modal-close-record-content">
        <FormattedMessage id="marva.confirm-close-rd" />
      </div>
    </Modal>
  );
};
