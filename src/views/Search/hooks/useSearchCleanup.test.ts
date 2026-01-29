import { renderHook } from '@testing-library/react';

import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useSearchStore, useUIStore } from '@/store';

import { useSearchCleanup } from './useSearchCleanup';

const mockDispatchDropNavigateToOriginEvent = jest.fn();

jest.mock('@/common/hooks/useContainerEvents', () => ({
  useContainerEvents: () => ({
    dispatchDropNavigateToOriginEvent: mockDispatchDropNavigateToOriginEvent,
  }),
}));

describe('useSearchCleanup', () => {
  const mockResetSelectedInstances = jest.fn();
  const mockResetFullDisplayComponentType = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          resetSelectedInstances: mockResetSelectedInstances,
        },
      },
      {
        store: useUIStore,
        state: {
          resetFullDisplayComponentType: mockResetFullDisplayComponentType,
        },
      },
    ]);
  });

  test('Dispatches navigation event on mount', () => {
    renderHook(() => useSearchCleanup());

    expect(mockDispatchDropNavigateToOriginEvent).toHaveBeenCalled();
  });

  test('Cleans up state on unmount', () => {
    const { unmount } = renderHook(() => useSearchCleanup());

    unmount();

    expect(mockResetFullDisplayComponentType).toHaveBeenCalled();
    expect(mockResetSelectedInstances).toHaveBeenCalled();
  });
});
