import { FC, useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { useModalControls } from '@common/hooks/useModalControls';
import state from '@state';
import { useRecoilValue } from 'recoil';
import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import './Prompt.scss';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { ROUTES } from '@common/constants/routes.constants';
import { ModalSwitchToNewRecord } from '@components/ModalSwitchToNewRecord';
import { useRecordControls } from '@common/hooks/useRecordControls';

interface Props {
  when: boolean;
}

export const Prompt: FC<Props> = ({ when: shouldPrompt }) => {
  const { saveRecord } = useRecordControls();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const customEvents = useRecoilValue(state.config.customEvents);
  const [isNextLocationNewRecordWithReference, setIsNextLocationNewRecordWithReference] = useState(false);

  const { TRIGGER_MODAL: triggerModalEvent, PROCEED_NAVIGATION: proceedNavigationEvent } = customEvents || {};

  useEffect(() => {
    IS_EMBEDDED_MODE && getWrapperAsWebComponent()?.addEventListener(triggerModalEvent, () => setIsModalOpen(true));
  }, []);

  const blocker = useBlocker(({ nextLocation: { pathname, search } }) => {
    if (pathname === ROUTES.RESOURCE_CREATE.uri && search) {
      setIsNextLocationNewRecordWithReference(true);
    } else {
      setIsNextLocationNewRecordWithReference(false);
    }

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

  const saveAndContinue = () => {
    proceedNavigation();

    saveRecord({ asRefToNewRecord: true });
  };

  const continueWithoutSaving = () => proceedNavigation();

  return isNextLocationNewRecordWithReference ? (
    <ModalSwitchToNewRecord
      isOpen={isModalOpen}
      onSubmit={saveAndContinue}
      onCancel={continueWithoutSaving}
      onClose={stopNavigation}
    />
  ) : (
    <ModalCloseRecord
      isOpen={isModalOpen}
      onCancel={proceedNavigation}
      onSubmit={stopNavigation}
      onClose={stopNavigation}
    />
  );
};
