import '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { useInputsStore, useUIStore } from '@/store';

import { useHubSearchPreviewQuery } from './useHubSearchPreviewQuery';

describe('useHubSearchPreviewQuery', () => {
  const mockSetActivePreviewIds = jest.fn();
  const mockResetFullDisplayComponentType = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useInputsStore,
        state: {
          setActivePreviewIds: mockSetActivePreviewIds,
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

  describe('loadHubPreview', () => {
    test('resets full display component type and sets active preview ID', () => {
      const { result } = renderHook(useHubSearchPreviewQuery);

      result.current.loadHubPreview('hub_1');

      expect(mockResetFullDisplayComponentType).toHaveBeenCalled();
      expect(mockSetActivePreviewIds).toHaveBeenCalledWith(['hub_1']);
    });

    test('handles consecutive calls with different IDs', () => {
      const { result } = renderHook(useHubSearchPreviewQuery);

      result.current.loadHubPreview('hub_1');
      result.current.loadHubPreview('hub_2');

      expect(mockSetActivePreviewIds).toHaveBeenNthCalledWith(1, ['hub_1']);
      expect(mockSetActivePreviewIds).toHaveBeenNthCalledWith(2, ['hub_2']);
    });
  });

  describe('isLoading state', () => {
    test('always returns false', () => {
      const { result } = renderHook(useHubSearchPreviewQuery);

      expect(result.current.isLoading).toBe(false);
    });
  });
});
