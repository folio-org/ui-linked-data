import { renderHook } from '@testing-library/react';
import { useContainerEvents } from '@common/hooks/useContainerEvents';
import * as domHelper from '@common/helpers/dom.helper';
import { useConfigStore, useStatusStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
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
});
