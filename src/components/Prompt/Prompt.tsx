import { FC, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { useModalControls } from '@common/hooks/useModalControls';
import state from '@state';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { ROUTES } from '@common/constants/routes.constants';
import { ModalSwitchToNewRecord } from '@components/ModalSwitchToNewRecord';
import { useRecordControls } from '@common/hooks/useRecordControls';
import './Prompt.scss';

interface Props {
  when: boolean;
}

export const Prompt: FC<Props> = ({ when: shouldPrompt }) => {
  const { saveRecord } = useRecordControls();
  const {
    isModalOpen: isCloseRecordModalOpen,
    setIsModalOpen: setIsCloseRecordModalOpen,
    openModal: openCloseRecordModal,
  } = useModalControls();
  const {
    isModalOpen: isSwitchToNewRecordModalOpen,
    setIsModalOpen: setIsSwitchToNewRecordModalOpen,
    openModal: openSwitchToNewRecordModal,
  } = useModalControls();
  const customEvents = useRecoilValue(state.config.customEvents);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);

  const { TRIGGER_MODAL: triggerModalEvent, PROCEED_NAVIGATION: proceedNavigationEvent } = customEvents || {};

  const closeAllModals = () => {
    setIsCloseRecordModalOpen(false);
    setIsSwitchToNewRecordModalOpen(false);
  };

  useEffect(() => {
    IS_EMBEDDED_MODE &&
      getWrapperAsWebComponent()?.addEventListener(triggerModalEvent, () => setIsCloseRecordModalOpen(true));
  }, []);

  const blocker = useBlocker(({ nextLocation: { pathname, search } }) => {
    if (shouldPrompt) {
      if (pathname === ROUTES.RESOURCE_CREATE.uri && search) {
        openSwitchToNewRecordModal();
      } else {
        openCloseRecordModal();
      }
    }

    return shouldPrompt;
  });

  const stopNavigation = () => {
    closeAllModals();
    blocker.reset?.();
  };

  const proceedNavigation = () => {
    IS_EMBEDDED_MODE && getWrapperAsWebComponent()?.dispatchEvent(new CustomEvent(proceedNavigationEvent));

    closeAllModals();
    setIsEdited(false);
    blocker.proceed?.();
  };

  const saveAndContinue = () => {
    proceedNavigation();

    saveRecord({ asRefToNewRecord: true });
  };

  const continueWithoutSaving = () => proceedNavigation();

  return (
    <>
      <ModalSwitchToNewRecord
        isOpen={isSwitchToNewRecordModalOpen}
        onSubmit={saveAndContinue}
        onCancel={continueWithoutSaving}
        onClose={stopNavigation}
      />
      <ModalCloseRecord
        isOpen={isCloseRecordModalOpen}
        onCancel={proceedNavigation}
        onSubmit={stopNavigation}
        onClose={stopNavigation}
      />
    </>
  );
};
