import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { useInputsStore } from '@/store';

import { useRecordNavigation } from './useRecordNavigation';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: {} }),
  useSearchParams: () => [new URLSearchParams('type=hub'), jest.fn()],
}));

jest.mock('@/features/resources', () => ({
  getGraphIdByExternalId: jest.fn(),
}));

const mockDispatchUnblockEvent = jest.fn();
const mockDispatchNavigateToOriginEventWithFallback = jest.fn();

jest.mock('@/common/hooks/useContainerEvents', () => ({
  useContainerEvents: () => ({
    dispatchUnblockEvent: mockDispatchUnblockEvent,
    dispatchNavigateToOriginEventWithFallback: mockDispatchNavigateToOriginEventWithFallback,
  }),
}));

describe('useRecordNavigation', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockReturnValue();
  });

  describe('discardRecord', () => {
    it('discards record and navigates away with segment parameter', () => {
      setInitialGlobalState([
        {
          store: useInputsStore,
          state: {
            record: null,
            selectedRecordBlocks: null,
          },
        },
      ]);

      const { result } = renderHook(() => useRecordNavigation());
      result.current.discardRecord();

      expect(mockDispatchUnblockEvent).toHaveBeenCalled();
      expect(mockDispatchNavigateToOriginEventWithFallback).toHaveBeenCalledWith(
        expect.stringContaining('segment=hubs'),
      );
    });
  });
});
