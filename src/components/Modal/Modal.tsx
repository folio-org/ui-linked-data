import { FC, ReactNode, memo } from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import './Modal.scss';

interface Props extends ReactModal.Props {
  isOpen: boolean;
  title: string;
  className?: string;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  onSubmit: () => void;
  onCancel: () => void;
  onClose: () => void;
  children?: ReactNode;
}

export const Modal: FC<Props> = memo(
  ({ isOpen, className, title, submitButtonLabel, cancelButtonLabel, onSubmit, onCancel, onClose, children }) => {
    const rootElement = document.getElementById('editor-root') as HTMLElement;

    return (
      <ReactModal
        isOpen={isOpen}
        appElement={rootElement}
        role="dialog"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onRequestClose={onClose}
        overlayClassName="overlay"
        className={classNames(['modal', className])}
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
