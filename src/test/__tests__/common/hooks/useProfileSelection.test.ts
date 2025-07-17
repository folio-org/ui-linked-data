import { renderHook, act } from '@testing-library/react';
import { useProfileSelection } from '@common/hooks/useProfileSelection';
import { fetchPreferredProfiles, fetchProfiles } from '@common/api/profiles.api';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useLoadingState, useProfileState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';

jest.mock('@common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
  fetchProfiles: jest.fn(),
}));

jest.mock('@common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn().mockReturnValue('mocked-message'),
  },
}));

describe('useProfileSelection', () => {
  const setPreferredProfiles = jest.fn();
  const setAvailableProfiles = jest.fn();
  const setIsLoading = jest.fn();
  const setIsProfileSelectionModalOpen = jest.fn();
  const addStatusMessagesItem = jest.fn();
  const callbackMock = jest.fn();

  const resourceTypeURL = 'test-resource-type';
  const profileId = 'test-profile-id';
  const mockProfiles = [
    {
      id: profileId,
      name: 'Test Profile',
      resourceType: resourceTypeURL,
    },
    {
      id: 'other-profile',
      name: 'Other Profile',
      resourceType: 'other-type',
    },
  ];

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useProfileState,
        state: {
          preferredProfiles: null,
          availableProfiles: null,
          setPreferredProfiles,
          setAvailableProfiles,
        },
      },
      {
        store: useLoadingState,
        state: {
          setIsLoading,
        },
      },
      {
        store: useUIState,
        state: {
          setIsProfileSelectionModalOpen,
        },
      },
      {
        store: useStatusState,
        state: {
          addStatusMessagesItem,
        },
      },
    ]);
  });

  describe('checkProfileAndProceed', () => {
    test('calls callback with profile id when preferred profile exists for resource type', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(setPreferredProfiles).toHaveBeenCalledWith(mockProfiles);
      expect(callbackMock).toHaveBeenCalledWith(profileId);
      expect(setIsProfileSelectionModalOpen).not.toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('opens profile selection modal when no preferred profile matches resource type', async () => {
      const nonMatchingProfiles = [{ id: 'other-profile', name: 'Other Profile', resourceType: 'other-type' }];
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue(nonMatchingProfiles);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(setPreferredProfiles).toHaveBeenCalledWith(nonMatchingProfiles);
      expect(callbackMock).not.toHaveBeenCalled();
      expect(setIsProfileSelectionModalOpen).toHaveBeenCalledWith(true);
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('loads available profiles and opens modal when no preferred profiles exist', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(fetchProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(setAvailableProfiles).toHaveBeenCalledWith(mockProfiles);
      expect(setIsProfileSelectionModalOpen).toHaveBeenCalledWith(true);
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('skips loading available profiles if they are already loaded', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: null,
            availableProfiles: mockProfiles,
            setPreferredProfiles,
            setAvailableProfiles,
          },
        },
        {
          store: useLoadingState,
          state: {
            setIsLoading,
          },
        },
        {
          store: useUIState,
          state: {
            setIsProfileSelectionModalOpen,
          },
        },
        {
          store: useStatusState,
          state: {
            addStatusMessagesItem,
          },
        },
      ]);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(fetchPreferredProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setAvailableProfiles).not.toHaveBeenCalled();
      expect(setIsProfileSelectionModalOpen).toHaveBeenCalledWith(true);
    });

    test('handles error when loading preferred profiles', async () => {
      const error = new Error('Failed to load preferred profiles');
      (fetchPreferredProfiles as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorLoadingProfiles');
      expect(addStatusMessagesItem).toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('handles error when loading available profiles', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      const error = new Error('Failed to load available profiles');
      (fetchProfiles as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(fetchProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorLoadingProfiles');
      expect(addStatusMessagesItem).toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('getPreferredProfiles', () => {
    test('returns cached preferred profiles when they exist', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: mockProfiles,
            availableProfiles: null,
            setPreferredProfiles,
            setAvailableProfiles,
          },
        },
      ]);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(fetchPreferredProfiles).not.toHaveBeenCalled();
      expect(callbackMock).toHaveBeenCalledWith(profileId);
    });
  });
});
