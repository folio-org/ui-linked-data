import state from '@state';
import { useRecoilValue } from 'recoil';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { dispatchEventWrapper, getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { useEffect } from 'react';

type IUseContainerEvents =
  | {
      onTriggerModal?: VoidFunction;
      watchEditedState?: boolean;
    }
  | undefined;

export const useContainerEvents = ({ onTriggerModal, watchEditedState = false }: IUseContainerEvents = {}) => {
  const isEdited = useRecoilValue(state.status.recordIsEdited);
  const { BLOCK_NAVIGATION, UNBLOCK_NAVIGATION, TRIGGER_MODAL, PROCEED_NAVIGATION } =
    useRecoilValue(state.config.customEvents) ?? {};

  useEffect(() => {
    if (IS_EMBEDDED_MODE && TRIGGER_MODAL && onTriggerModal) {
      getWrapperAsWebComponent()?.addEventListener(TRIGGER_MODAL, onTriggerModal);

      return () => getWrapperAsWebComponent()?.removeEventListener(TRIGGER_MODAL, onTriggerModal);
    }
  }, [TRIGGER_MODAL, onTriggerModal]);

  useEffect(() => {
    if (IS_EMBEDDED_MODE && watchEditedState) {
      isEdited ? dispatchBlockEvent() : dispatchUnblockEvent();
    }
  }, [BLOCK_NAVIGATION, isEdited, watchEditedState]);

  const dispatchUnblockEvent = () => dispatchEventWrapper(UNBLOCK_NAVIGATION);

  const dispatchBlockEvent = () => dispatchEventWrapper(BLOCK_NAVIGATION);

  const dispatchProceedNavigationEvent = () => dispatchEventWrapper(PROCEED_NAVIGATION);

  return {
    dispatchUnblockEvent,
    dispatchProceedNavigationEvent,
    dispatchBlockEvent,
  };
};
