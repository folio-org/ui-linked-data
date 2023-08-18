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

const Modal: FC<Props> = ({
  isOpen,
  className,
  title,
  submitButtonLabel,
  cancelButtonLabel,
  onSubmit,
  onCancel,
  onClose,
  children,
}) => {
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
        <button onClick={onSubmit} data-testid="modal-button-submit">
          {submitButtonLabel}
        </button>
        <button onClick={onCancel} data-testid="modal-button-cancel">
          {cancelButtonLabel}
        </button>
      </div>
    </ReactModal>
  );
};

export default memo(Modal);
