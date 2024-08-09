import { FC, useEffect, useState } from 'react';
import { matchPath, useBlocker } from 'react-router-dom';
import { useModalControls } from '@common/hooks/useModalControls';
import state from '@state';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import { ModalSwitchToNewRecord } from '@components/ModalSwitchToNewRecord';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { RecordStatus } from '@common/constants/record.constants';
import './Prompt.scss';

interface Props {
  when: boolean;
}

enum ForceNavigateToDest {
  EditPage = 'editPage',
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
  const setRecordStatus = useSetRecoilState(state.status.recordStatus);
  const [forceNavigateTo, setForceNavigateTo] = useState<{ pathname: string; search: string, to?: ForceNavigateToDest | null } | null>(null);
  const { navigateToEditPage } = useNavigateToEditPage();

  const { TRIGGER_MODAL: triggerModalEvent, PROCEED_NAVIGATION: proceedNavigationEvent } = customEvents || {};

  const closeAllModals = () => {
    setIsCloseRecordModalOpen(false);
    setIsSwitchToNewRecordModalOpen(false);
  };

  useEffect(() => {
    IS_EMBEDDED_MODE &&
      getWrapperAsWebComponent()?.addEventListener(triggerModalEvent, () => setIsCloseRecordModalOpen(true));
  }, []);

  const blocker = useBlocker(({ currentLocation, nextLocation: { pathname, search } }) => {
    // TODO: investigate what's the case for this behavior
    if (currentLocation?.pathname === pathname) return false;

    // ATM that means we're switching to a new record which will
    // use the current one as a reference. Meaning, we'll have to
    // update the current record and force navigate to the updated
    // ID we receive from the update operation
    const navigatingToCreatePage =
      matchPath(ROUTES.RESOURCE_CREATE.uri, pathname) && search && search.includes(QueryParams.PerformIdUpdate);
    const navigatingToEditPage = matchPath(ROUTES.RESOURCE_EDIT.uri, pathname);

    if (shouldPrompt) {
      if (navigatingToEditPage || navigatingToCreatePage) {
        setForceNavigateTo({ pathname, search, to: navigatingToEditPage && ForceNavigateToDest.EditPage });

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
    setRecordStatus({ type: RecordStatus.open });
  };

  const saveAndContinue = async () => {
    const recordId = await saveRecord({ asRefToNewRecord: true, shouldSetSearchParams: !forceNavigateTo });
    setRecordStatus({ type: RecordStatus.saveAndClose })

    if (!forceNavigateTo) {
      proceedNavigation();
    } else {
      stopNavigation();

      if (forceNavigateTo.to === ForceNavigateToDest.EditPage) {
        setRecordStatus({ type: RecordStatus.saveAndClose })

        navigateToEditPage(forceNavigateTo.pathname, { replace: true })
      } else {
        const newSearchParams = new URLSearchParams(forceNavigateTo?.search);
        
        newSearchParams.set(QueryParams.Ref, recordId);
        newSearchParams.delete(QueryParams.PerformIdUpdate);
        
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
