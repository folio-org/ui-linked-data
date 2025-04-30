import { renderHook } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dispatchEventWrapper } from '@common/helpers/dom.helper';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import * as domHelper from '@common/helpers/dom.helper';
import { useConfigStore, useStatusStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { ROUTES } from '@common/constants/routes.constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('@common/helpers/dom.helper', () => ({
  dispatchEventWrapper: jest.fn(),
}));

const mockDispatchEventWrapper = jest.fn();
const mockEvents = {
  BLOCK_NAVIGATION: 'mockBlock',
  UNBLOCK_NAVIGATION: 'mockUnblock',
};
jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

describe('useContainerEvents', () => {
  const renderUseContainerEventsHook = (isRecordEdited: boolean) => {
    (domHelper.dispatchEventWrapper as jest.Mock) = mockDispatchEventWrapper;

    setInitialGlobalState([
      {
        store: useStatusStore,
        state: { isRecordEdited },
      },
      {
        store: useConfigStore,
        state: { customEvents: mockEvents },
      },
    ]);

    renderHook(() => useContainerEvents({ watchEditedState: true }));
  };

  it('dispatches block event', () => {
    renderUseContainerEventsHook(true);

    expect(mockDispatchEventWrapper).toHaveBeenCalledWith(mockEvents.BLOCK_NAVIGATION);
  });

  it('dispatches unblock event', () => {
    renderUseContainerEventsHook(false);

    expect(mockDispatchEventWrapper).toHaveBeenCalledWith(mockEvents.UNBLOCK_NAVIGATION);
  });

  describe('dispatchNavigateToOriginEventWithFallback', () => {
    const mockNavigate = jest.fn();
    const mockDispatchEvent = jest.fn();
    const fallbackUri = '/test-fallback';

    beforeEach(() => {
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      (dispatchEventWrapper as jest.Mock).mockImplementation(mockDispatchEvent);
      jest.clearAllMocks();
    });

    const setupTest = (hasNavigationOrigin: boolean, isNavigatedFromLDE = false) => {
      (useLocation as jest.Mock).mockReturnValue({
        state: isNavigatedFromLDE ? { isNavigatedFromLDE: true } : {},
      });

      const mockCustomEvents = {
        NAVIGATE_TO_ORIGIN: 'navigate-to-origin',
      };

      setInitialGlobalState([
        {
          store: useConfigStore,
          state: { hasNavigationOrigin, customEvents: mockCustomEvents },
        },
      ]);

      return renderHook(() => useContainerEvents());
    };

    it('dispatches NAVIGATE_TO_ORIGIN event when hasNavigationOrigin is true and not navigated from LDE', () => {
      const { result } = setupTest(true, false);

      result.current.dispatchNavigateToOriginEventWithFallback(fallbackUri);

      expect(mockDispatchEvent).toHaveBeenCalledWith('navigate-to-origin');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates to fallbackUri when hasNavigationOrigin is false', () => {
      const { result } = setupTest(false);

      result.current.dispatchNavigateToOriginEventWithFallback(fallbackUri);

      expect(mockNavigate).toHaveBeenCalledWith(fallbackUri);
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });

    it('navigates to search route when no fallbackUri is provided', () => {
      const { result } = setupTest(false);

      result.current.dispatchNavigateToOriginEventWithFallback();

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SEARCH.uri);
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });

    it('navigates to fallbackUri when navigated from LDE, even if hasNavigationOrigin is true', () => {
      const { result } = setupTest(true, true);

      result.current.dispatchNavigateToOriginEventWithFallback(fallbackUri);

      expect(mockNavigate).toHaveBeenCalledWith(fallbackUri);
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });

    it('navigates to search route when navigated from LDE and no fallbackUri provided', () => {
      const { result } = setupTest(true, true);

      result.current.dispatchNavigateToOriginEventWithFallback();

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SEARCH.uri);
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });
  });
});
