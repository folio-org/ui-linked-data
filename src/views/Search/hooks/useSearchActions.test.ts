import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { ImportFilterTypes } from '@/common/constants/import.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { FullDisplayType } from '@/common/constants/uiElements.constants';

import { useUIStore } from '@/store';

import { useSearchActions } from './useSearchActions';

const mockOnCreateNewResource = jest.fn();
const mockUseNavigate = jest.fn();
const mockNavigateToManageProfileSettings = jest.fn();

jest.mock('@/features/profiles/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({
    onCreateNewResource: mockOnCreateNewResource,
  }),
}));

jest.mock('@/features/manageProfileSettings/hooks/useNavigateToManageProfileSettings', () => ({
  useNavigateToManageProfileSettings: () => ({
    navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('useSearchActions', () => {
  const mockSetFullDisplayComponentType = jest.fn();
  const mockSetIsImportModalOpen = jest.fn();
  const mockSetImportModalFilterType = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          setFullDisplayComponentType: mockSetFullDisplayComponentType,
          isImportModalOpen: false,
          setIsImportModalOpen: mockSetIsImportModalOpen,
          setImportModalFilterType: mockSetImportModalFilterType,
        },
      },
    ]);
  });

  describe('handlePreviewMultiple', () => {
    test('opens comparison view', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.handlePreviewMultiple();

      expect(mockSetFullDisplayComponentType).toHaveBeenCalledWith(FullDisplayType.Comparison);
    });
  });

  describe('handleImportInstances', () => {
    test('Opens import modal when closed', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.handleImportInstances();

      expect(mockSetIsImportModalOpen).toHaveBeenCalledWith(true);
      expect(mockSetImportModalFilterType).toHaveBeenCalledWith(ImportFilterTypes.Instance);
    });

    test('Does not open import modal when already open', () => {
      setInitialGlobalState([
        {
          store: useUIStore,
          state: {
            isImportModalOpen: true,
            setIsImportModalOpen: mockSetIsImportModalOpen,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchActions());

      result.current.handleImportInstances();

      expect(mockSetIsImportModalOpen).not.toHaveBeenCalled();
    });
  });

  describe('handleImportHubs', () => {
    test('Opens import modal when closed', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.handleImportHubs();

      expect(mockSetIsImportModalOpen).toHaveBeenCalledWith(true);
      expect(mockSetImportModalFilterType).toHaveBeenCalledWith(ImportFilterTypes.Hub);
    });

    test('Does not open import modal when already open', () => {
      setInitialGlobalState([
        {
          store: useUIStore,
          state: {
            isImportModalOpen: true,
            setIsImportModalOpen: mockSetIsImportModalOpen,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchActions());

      result.current.handleImportHubs();

      expect(mockSetIsImportModalOpen).not.toHaveBeenCalled();
    });
  });

  describe('onClickNewWork', () => {
    test('Navigates to create new Work resource', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.onClickNewWork();

      expect(mockOnCreateNewResource).toHaveBeenCalledWith({
        resourceTypeURL: TYPE_URIS.WORK,
        queryParams: {
          type: ResourceType.work,
        },
      });
    });
  });

  describe('onClickNewHub', () => {
    test('Navigates to create new Hub resource', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.onClickNewHub();

      expect(mockOnCreateNewResource).toHaveBeenCalledWith({
        resourceTypeURL: TYPE_URIS.HUB,
        queryParams: {
          type: ResourceType.hub,
        },
      });
    });
  });

  describe('navigateToManageProfileSettings', () => {
    test('Navigates to manage profile settings view', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.navigateToManageProfileSettings();

      expect(mockNavigateToManageProfileSettings).toHaveBeenCalled();
    });
  });
});
