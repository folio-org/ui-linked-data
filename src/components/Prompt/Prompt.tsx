import { FC, useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import { useModalControls } from '@common/hooks/useModalControls';
import state from '@state';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';
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
  const [forceNavigateTo, setForceNavigateTo] = useState<{ pathname: string; search: string } | null>(null);
  const navigate = useNavigate();

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
      if (pathname === ROUTES.RESOURCE_CREATE.uri && search && search.includes(QueryParams.PerformIdUpdate)) {
        // ATM that means we're switching to a new record which will
        // use the current one as a reference. Meaning, we'll have to
        // update the current record and force navigate to the updated
        // ID we receive from the update operation
        setForceNavigateTo({ pathname, search });
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

  const saveAndContinue = async () => {
    const recordId = await saveRecord({ asRefToNewRecord: true, shouldSetSearchParams: !forceNavigateTo });

    if (!forceNavigateTo) {
      proceedNavigation();
    } else {
      blocker?.reset?.();
      const newSearchParams = new URLSearchParams(forceNavigateTo?.search);
      newSearchParams.set(QueryParams.Ref, recordId);
      newSearchParams.delete(QueryParams.PerformIdUpdate);
      navigate(`${forceNavigateTo.pathname}?${newSearchParams.toString()}`, { replace: true });
    }
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
