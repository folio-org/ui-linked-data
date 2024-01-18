import { FC, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useModalControls } from '@common/hooks/useModalControls';
import { Modal } from '@components/Modal';
import state from '@state';
import { useRecoilValue } from 'recoil';
import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import './Prompt.scss';

interface Props {
  when: boolean;
}

export const Prompt: FC<Props> = ({ when: shouldPrompt }) => {
  const { formatMessage } = useIntl();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const customEvents = useRecoilValue(state.config.customEvents);

  const { TRIGGER_MODAL: triggerModalEvent, PROCEED_NAVIGATION: proceedNavigationEvent } = customEvents || {};

  useEffect(() => {
    IS_EMBEDDED_MODE && getWrapperAsWebComponent()?.addEventListener(triggerModalEvent, () => setIsModalOpen(true));
  }, []);

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
    IS_EMBEDDED_MODE && getWrapperAsWebComponent()?.dispatchEvent(new CustomEvent(proceedNavigationEvent));

    setIsModalOpen(false);
    blocker.proceed?.();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title={formatMessage({ id: 'marva.closeRd' })}
      cancelButtonLabel={formatMessage({ id: 'marva.yes' })}
      submitButtonLabel={formatMessage({ id: 'marva.no' })}
      onClose={stopNavigation}
      onSubmit={stopNavigation}
      onCancel={proceedNavigation}
    >
      <div className="prompt-content" data-testid="modal-close-record-content">
        <FormattedMessage id="marva.confirmCloseRd" />
      </div>
    </Modal>
  );
};
