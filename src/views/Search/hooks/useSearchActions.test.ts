import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook, waitFor } from '@testing-library/react';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { ResourceType } from '@/common/constants/record.constants';
import { StatusType } from '@/common/constants/status.constants';
import { FullDisplayType } from '@/common/constants/uiElements.constants';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useInputsStore, useLoadingStateStore, useSearchStore, useStatusStore, useUIStore } from '@/store';

import { useSearchActions } from './useSearchActions';

const mockOnCreateNewResource = jest.fn();
const mockFetchRecord = jest.fn();
const mockUseNavigate = jest.fn();
const mockNavigateToManageProfileSettings = jest.fn();

jest.mock('@/common/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({
    onCreateNewResource: mockOnCreateNewResource,
  }),
}));

jest.mock('@/features/manageProfileSettings/hooks/useNavigateToManageProfileSettings', () => ({
  useNavigateToManageProfileSettings: () => ({
    navigateToManageProfileSettings: mockNavigateToManageProfileSettings,
  }),
}));

jest.mock('@/common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    fetchRecord: mockFetchRecord,
  }),
}));

jest.mock('@/common/services/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('useSearchActions', () => {
  const mockSetIsLoading = jest.fn();
  const mockResetPreviewContent = jest.fn();
  const mockSetFullDisplayComponentType = jest.fn();
  const mockSetIsImportModalOpen = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          selectedInstances: ['instance_1', 'instance_2'],
        },
      },
      {
        store: useLoadingStateStore,
        state: {
          setIsLoading: mockSetIsLoading,
        },
      },
      {
        store: useInputsStore,
        state: {
          resetPreviewContent: mockResetPreviewContent,
        },
      },
      {
        store: useUIStore,
        state: {
          setFullDisplayComponentType: mockSetFullDisplayComponentType,
          isImportModalOpen: false,
          setIsImportModalOpen: mockSetIsImportModalOpen,
        },
      },
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
    ]);

    mockFetchRecord.mockResolvedValue(undefined);
  });

  describe('handlePreviewMultiple', () => {
    test('Fetches records for preview in reversed order', async () => {
      const { result } = renderHook(() => useSearchActions());

      await result.current.handlePreviewMultiple();

      await waitFor(() => {
        expect(mockSetIsLoading).toHaveBeenCalledWith(true);
        expect(mockResetPreviewContent).toHaveBeenCalled();
        expect(mockSetFullDisplayComponentType).toHaveBeenCalledWith(FullDisplayType.Comparison);
        expect(mockFetchRecord).toHaveBeenCalledTimes(2);
        expect(mockFetchRecord).toHaveBeenNthCalledWith(1, 'instance_2', {});
        expect(mockFetchRecord).toHaveBeenNthCalledWith(2, 'instance_1', {});
        expect(mockSetIsLoading).toHaveBeenCalledWith(false);
      });
    });

    test('Handles error during record fetching', async () => {
      const error = new Error('Fetch failed');
      mockFetchRecord.mockRejectedValueOnce(error);
      const mockMessage = { type: StatusType.error, content: 'error' };
      (UserNotificationFactory.createMessage as jest.Mock).mockReturnValue(mockMessage);

      const { result } = renderHook(() => useSearchActions());

      await result.current.handlePreviewMultiple();

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith('Error fetching records for preview:', error);
        expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorFetching');
        expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(mockMessage);
        expect(mockSetIsLoading).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('handleImport', () => {
    test('Opens import modal when closed', () => {
      const { result } = renderHook(() => useSearchActions());

      result.current.handleImport();

      expect(mockSetIsImportModalOpen).toHaveBeenCalledWith(true);
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

      result.current.handleImport();

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

  describe('handleHubEdit', () => {
    test('Returns empty function', () => {
      const { result } = renderHook(() => useSearchActions());

      expect(result.current.handleHubEdit).toBeInstanceOf(Function);
      expect(result.current.handleHubEdit()).toBeUndefined();
    });
  });

  describe('handleHubImport', () => {
    test('Returns empty function', () => {
      const { result } = renderHook(() => useSearchActions());

      expect(result.current.handleHubImport).toBeInstanceOf(Function);
      expect(result.current.handleHubImport()).toBeUndefined();
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
