import { FC, ReactNode, memo, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import './Modal.scss';

interface Props extends ReactModal.Props {
  title: string;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  onSubmit: () => void;
  onCancel: () => void;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal: FC<Props> = memo(
  ({ isOpen, title, submitButtonLabel, cancelButtonLabel, onSubmit, onCancel, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(isOpen);
    const rootElement = document.getElementById('editor-root') as HTMLElement;

    useEffect(() => {
      setIsVisible(isOpen);
    }, [isOpen]);

    return (
      <ReactModal
        isOpen={isVisible}
        appElement={rootElement}
        role="dialog"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onRequestClose={onClose}
        overlayClassName="overlay"
        className="modal"
      >
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        {!!children && <div>{children}</div>}
        <div className="modal-controls">
          <button onClick={onSubmit}>{submitButtonLabel}</button>
          <button onClick={onCancel}>{cancelButtonLabel}</button>
        </div>
      </ReactModal>
    );
  },
);
