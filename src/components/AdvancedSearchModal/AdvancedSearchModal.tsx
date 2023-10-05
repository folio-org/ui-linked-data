import { FC, memo } from 'react';
import { useIntl } from 'react-intl';
import { Modal } from '../Modal';
import './AdvancedSearchModal.scss'

interface Props {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
}

export const AdvancedSearchModal: FC<Props> = memo(({ isOpen, toggleIsOpen }) => {
  const { formatMessage } = useIntl();

  const closeModal = () => {
    toggleIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={formatMessage({ id: 'marva.advanced-search' })}
      submitButtonLabel={formatMessage({ id: 'marva.search' })}
      cancelButtonLabel={formatMessage({ id: 'marva.cancel' })}
      onClose={closeModal}
      onSubmit={closeModal}
      onCancel={closeModal}
      shouldCloseOnEsc
    >
      <div className="advanced-search-container">[Advanced search modal content]</div>
    </Modal>
  );
});
