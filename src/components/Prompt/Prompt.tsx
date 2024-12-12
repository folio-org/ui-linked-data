import { FC, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { useModalControls } from '@common/hooks/useModalControls';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { ForceNavigateToDest, QueryParams } from '@common/constants/routes.constants';
import { ModalSwitchToNewRecord } from '@components/ModalSwitchToNewRecord';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { RecordStatus } from '@common/constants/record.constants';
import { getForceNavigateToDest } from '@common/helpers/navigation.helper';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import { useStatusState } from '@src/store';
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
  const { setIsEditedRecord: setIsEdited, setRecordStatus } = useStatusState();
  const [forceNavigateTo, setForceNavigateTo] = useState<{
    pathname: string;
    search: string;
    to?: ForceNavigateToDest | null;
  } | null>(null);
  const { navigateToEditPage } = useNavigateToEditPage();
  const { dispatchProceedNavigationEvent, dispatchUnblockEvent } = useContainerEvents({
    onTriggerModal: () => setIsCloseRecordModalOpen(true),
  });

  const closeAllModals = () => {
    setIsCloseRecordModalOpen(false);
    setIsSwitchToNewRecordModalOpen(false);
  };

  const blocker = useBlocker(({ currentLocation, nextLocation: { pathname, search } }) => {
    // TODO: investigate what's the case for this behavior
    if (currentLocation?.pathname === pathname) return false;

    // ATM that means we're switching to a new record which will
    // use the current one as a reference. Meaning, we'll have to
    // update the current record and force navigate to the updated
    // ID we receive from the update operation

    if (shouldPrompt) {
      const forceNavigateToDest = getForceNavigateToDest(pathname, search);

      if (forceNavigateToDest) {
        setForceNavigateTo({ pathname, search, to: forceNavigateToDest });

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
    dispatchProceedNavigationEvent();
    closeAllModals();
    setIsEdited(false);
    blocker.proceed?.();
    setRecordStatus({ type: RecordStatus.open });
  };

  const saveAndContinue = async () => {
    const recordId = await saveRecord({ asRefToNewRecord: true, shouldSetSearchParams: !forceNavigateTo });
    setRecordStatus({ type: RecordStatus.saveAndClose });

    if (!forceNavigateTo) {
      proceedNavigation();
    } else {
      stopNavigation();
      dispatchUnblockEvent();

      if (forceNavigateTo.to === ForceNavigateToDest.EditPage) {
        navigateToEditPage(forceNavigateTo.pathname, { replace: true });
      } else {
        const newSearchParams = new URLSearchParams(forceNavigateTo?.search);

        forceNavigateTo.to === ForceNavigateToDest.CreatePage
          ? newSearchParams.set(QueryParams.Ref, recordId)
          : newSearchParams.set(QueryParams.CloneOf, recordId);

        navigateToEditPage(`${forceNavigateTo.pathname}?${newSearchParams}`, { replace: true });
      }
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
