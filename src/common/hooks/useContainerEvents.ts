import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { dispatchEventWrapper, getWrapperAsWebComponent } from '@common/helpers/dom.helper';
import { ROUTES } from '@common/constants/routes.constants';
import { useConfigState, useStatusState } from '@src/store';

type IUseContainerEvents =
  | {
      onTriggerModal?: VoidFunction;
      watchEditedState?: boolean;
    }
  | undefined;

export const useContainerEvents = ({ onTriggerModal, watchEditedState = false }: IUseContainerEvents = {}) => {
  const { hasNavigationOrigin, customEvents } = useConfigState();
  const { isRecordEdited: isEdited } = useStatusState();
  const {
    BLOCK_NAVIGATION,
    UNBLOCK_NAVIGATION,
    TRIGGER_MODAL,
    PROCEED_NAVIGATION,
    NAVIGATE_TO_ORIGIN,
    DROP_NAVIGATE_TO_ORIGIN,
  } = customEvents ?? {};
  const navigate = useNavigate();
  const location = useLocation();

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

  const dispatchNavigateToOriginEventWithFallback = (fallbackUri?: string) => {
    if (hasNavigationOrigin && !location.state?.origin) {
      dispatchEventWrapper(NAVIGATE_TO_ORIGIN);
    } else {
      navigate(fallbackUri ?? ROUTES.SEARCH.uri);
    }
  };

  const dispatchDropNavigateToOriginEvent = () => dispatchEventWrapper(DROP_NAVIGATE_TO_ORIGIN);

  return {
    dispatchUnblockEvent,
    dispatchProceedNavigationEvent,
    dispatchBlockEvent,
    dispatchNavigateToOriginEventWithFallback,
    dispatchDropNavigateToOriginEvent,
  };
};
