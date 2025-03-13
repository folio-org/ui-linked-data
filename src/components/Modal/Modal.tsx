import { FC, ReactNode, memo, useEffect, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { AriaModalKind, MODAL_CONTAINER_ID } from '@common/constants/uiElements.constants';
import Times16 from '@src/assets/times-16.svg?react';
import { Button, ButtonType } from '@components/Button';
import './Modal.scss';
import { useIntl } from 'react-intl';
// TODO: UILD-147 - Uncomment for using with Shadow DOM
// import { WEB_COMPONENT_NAME } from '@common/constants/web-component';

interface Props {
  id?: string;
  isOpen: boolean;
  title: string | ReactElement<any>;
  className?: string;
  classNameHeader?: string;
  submitButtonDisabled?: boolean;
  cancelButtonDisabled?: boolean;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  shouldCloseOnEsc?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  children?: ReactNode;
  showCloseIconButton?: boolean;
  showModalControls?: boolean;
  titleClassName?: string;
  alignTitleCenter?: boolean;
  ariaModalKind?: string;
}

const Modal: FC<Props> = ({
  id,
  isOpen,
  className,
  classNameHeader,
  title,
  submitButtonLabel,
  cancelButtonLabel,
  shouldCloseOnEsc = true,
  onSubmit,
  onCancel,
  onClose,
  children,
  submitButtonDisabled,
  cancelButtonDisabled,
  showCloseIconButton = true,
  showModalControls = true,
  titleClassName,
  alignTitleCenter = false,
  ariaModalKind = AriaModalKind.Basic,
}) => {
  const { formatMessage } = useIntl();
  const portalElement = document.getElementById(MODAL_CONTAINER_ID) as Element;

  // TODO: UILD-147 - uncomment for using with Shadow DOM
  // || (document.querySelector(WEB_COMPONENT_NAME)?.shadowRoot?.getElementById(MODAL_CONTAINER_ID) as Element)

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (!shouldCloseOnEsc || event.key !== 'Escape') return;

      onClose();
    }

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const elementId = `modal-${id ?? 'default'}`;
  const existingElement = !document.getElementById(elementId);

  return isOpen && portalElement && !existingElement
    ? createPortal(
        <div id={elementId}>
          <div className="overlay" onClick={onClose} role="presentation" data-testid="modal-overlay" />
          <div className={classNames(['modal', className])} role="dialog" data-testid="modal">
            <div className={classNames(['modal-header', classNameHeader])}>
              {showCloseIconButton && (
                <button
                  onClick={onClose}
                  className="close-button"
                  aria-label={formatMessage({ id: 'ld.aria.modal.close' }, { modalKind: ariaModalKind })}
                >
                  <Times16 />
                </button>
              )}
              <h3 className={classNames(['title', titleClassName])}>{title}</h3>
              {alignTitleCenter && <span className="empty-block" />}
            </div>
            {!!children && children}
            {showModalControls && (
              <div className="modal-controls">
                <Button
                  disabled={cancelButtonDisabled}
                  onClick={onCancel}
                  type={ButtonType.Primary}
                  data-testid="modal-button-cancel"
                >
                  {cancelButtonLabel}
                </Button>
                <Button
                  disabled={submitButtonDisabled}
                  type={ButtonType.Highlighted}
                  onClick={onSubmit}
                  data-testid="modal-button-submit"
                >
                  {submitButtonLabel}
                </Button>
              </div>
            )}
          </div>
        </div>,
        portalElement,
      )
    : null;
};

export default memo(Modal);
