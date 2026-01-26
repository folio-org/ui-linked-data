import { renderHook, act } from '@testing-library/react';
import { useProfileSelection } from '@common/hooks/useProfileSelection';
import { fetchPreferredProfiles, fetchProfiles } from '@common/api/profiles.api';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useLoadingState, useProfileState, useStatusState, useUIState } from '@src/store';
import { StatusType } from '@common/constants/status.constants';
import * as BibframeConstants from '@common/constants/bibframe.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

jest.mock('@common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
  fetchProfiles: jest.fn(),
}));

jest.mock('@common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn().mockReturnValue('mocked-message'),
  },
}));

enum MockBibframeEntitiesMap {
  'test-resource-type' = 'test-resource-type',
}
const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'BibframeEntitiesMap');
mockImportedConstant(MockBibframeEntitiesMap);

describe('useProfileSelection', () => {
  const setAvailableProfiles = jest.fn();
  const setIsLoading = jest.fn();
  const setIsProfileSelectionModalOpen = jest.fn();
  const addStatusMessagesItem = jest.fn();
  const callbackMock = jest.fn();

  const resourceTypeURL = 'test-resource-type' as ResourceTypeURL;
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
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
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
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
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
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
      expect(fetchProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(setAvailableProfiles).toHaveBeenCalled();
      const callArg = setAvailableProfiles.mock.calls[0][0];
      expect(typeof callArg).toBe('function');
      expect(setIsProfileSelectionModalOpen).toHaveBeenCalledWith(true);
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('auto-selects profile when only one available profile exists', async () => {
      const singleProfile = [
        {
          id: 'single-profile-id',
          name: 'Single Profile',
          resourceType: resourceTypeURL,
        },
      ];
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      (fetchProfiles as jest.Mock).mockResolvedValue(singleProfile);

      const { result } = renderHook(() => useProfileSelection());
      await act(async () => {
        await result.current.checkProfileAndProceed({
          resourceTypeURL,
          callback: callbackMock,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
      expect(fetchProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(callbackMock).toHaveBeenCalledWith('single-profile-id');
      expect(setIsProfileSelectionModalOpen).not.toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('skips loading available profiles if they are already loaded', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: null,
            availableProfiles: { 'test-resource-type': mockProfiles },
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

      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
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
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
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
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
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
            setAvailableProfiles,
          },
        },
      ]);

      // Mock the API to return the cached profiles
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockProfiles);

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

  describe('openModalForProfileChange', () => {
    test('loads available profiles and opens modal for profile change', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const setProfileSelectionType = jest.fn();
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: null,
            availableProfiles: null,
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
            setProfileSelectionType,
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
        await result.current.openModalForProfileChange({
          resourceTypeURL,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
      expect(fetchProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(setAvailableProfiles).toHaveBeenCalled();
      const callArg = setAvailableProfiles.mock.calls[0][0];
      expect(typeof callArg).toBe('function');
      const prev = {};
      const updated = callArg(prev);
      expect(updated).toMatchObject({ 'test-resource-type': mockProfiles });
      expect(setIsProfileSelectionModalOpen).toHaveBeenCalledWith(true);
      expect(setProfileSelectionType).toHaveBeenCalledWith({
        action: 'change',
        resourceTypeURL: 'test-resource-type',
      });
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('skips loading available profiles if they are already loaded', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      const setProfileSelectionType = jest.fn();
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: null,
            availableProfiles: { 'test-resource-type': mockProfiles },
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
            setProfileSelectionType,
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
        await result.current.openModalForProfileChange({
          resourceTypeURL,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setAvailableProfiles).not.toHaveBeenCalled();
      expect(setIsProfileSelectionModalOpen).toHaveBeenCalledWith(true);
      expect(setProfileSelectionType).toHaveBeenCalledWith({
        action: 'change',
        resourceTypeURL: 'test-resource-type',
      });
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    test('handles error when loading available profiles', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);
      const error = new Error('Failed to load available profiles');
      (fetchProfiles as jest.Mock).mockRejectedValue(error);

      const setProfileSelectionType = jest.fn();
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: null,
            availableProfiles: null,
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
            setProfileSelectionType,
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
        await result.current.openModalForProfileChange({
          resourceTypeURL,
        });
      });

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(fetchPreferredProfiles).toHaveBeenCalledWith();
      expect(fetchProfiles).toHaveBeenCalledWith(resourceTypeURL);
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorLoadingProfiles');
      expect(addStatusMessagesItem).toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
  });
});
