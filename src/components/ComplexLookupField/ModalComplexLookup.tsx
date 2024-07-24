import { FC, memo } from 'react';
import { Modal } from '@components/Modal';
import './ModalComplexLookup.scss';

interface Props {
  isOpen: boolean;
  onClose: VoidFunction;
  title?: string;
}

export const ModalComplexLookup: FC<Props> = memo(({ isOpen, onClose, title = '' }) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      titleClassName="modal-complex-lookup-title"
      showModalControls={false}
    >
      <div className="complex-lookup-search-contents" data-testid="complex-lookup-search-contents">
        {/* TODO: add the required content */}
        <p>Modal content</p>
      </div>
    </Modal>
  );
});
