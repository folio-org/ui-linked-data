import { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { Modal } from '@/components/Modal';

interface LookupModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  title: string | ReactElement;
  children: ReactNode;
}

/**
 * LookupModal - Shared modal wrapper for all complex lookup modals.
 * Provides consistent styling and structure.
 */
export const LookupModal: FC<LookupModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      titleClassName="modal-complex-lookup-title"
      className={classNames(['modal-complex-lookup', IS_EMBEDDED_MODE && 'modal-complex-lookup-embedded'])}
      classNameHeader={classNames([
        'modal-complex-lookup-header',
        IS_EMBEDDED_MODE && 'modal-complex-lookup-header-embedded',
      ])}
      showModalControls={false}
    >
      <div className="complex-lookup-search-contents" data-testid="complex-lookup-search-contents">
        {children}
      </div>
    </Modal>
  );
};
