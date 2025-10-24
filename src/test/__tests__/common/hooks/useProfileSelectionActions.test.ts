import { renderHook, act } from '@testing-library/react';
import { useProfileSelectionActions } from '@common/hooks/useProfileSelectionActions';
import { savePreferredProfile } from '@common/api/profiles.api';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { getProfileNameById, createUpdatedPreferredProfiles } from '@common/helpers/profileActions.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useNavigationState, useStatusState, useProfileState, useLoadingState } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { StatusType } from '@common/constants/status.constants';
import { ROUTES } from '@common/constants/routes.constants';

jest.mock('@common/api/profiles.api', () => ({
  savePreferredProfile: jest.fn(),
}));

jest.mock('@common/helpers/navigation.helper', () => ({
  generatePageURL: jest.fn(),
}));

jest.mock('@common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: jest.fn(),
}));

jest.mock('@common/hooks/useRecordControls', () => ({
  useRecordControls: jest.fn(),
}));

jest.mock('@common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn().mockReturnValue('mocked-message'),
  },
}));

jest.mock('@common/helpers/profileActions.helper', () => ({
  getProfileNameById: jest.fn(),
  createUpdatedPreferredProfiles: jest.fn(),
}));

describe('useProfileSelectionActions', () => {
  const mockResetModalState = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();
  const mockNavigateToEditPage = jest.fn();
  const mockChangeRecordProfile = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockSetPreferredProfiles = jest.fn();
  const mockQueryParams = { param: 'value' };
  const mockProfileId = 'profile-123';
  const mockResourceTypeURL = 'test-resource-type' as ResourceTypeURL;
  const mockGeneratedURL = '/generated-url';
  const mockProfileName = 'Test Profile';
  const mockPreferredProfiles = [{ id: 'existing-id', name: 'Existing Profile', resourceType: 'other-type' }];
  const mockAvailableProfiles = {
    [mockResourceTypeURL]: [{ id: mockProfileId, name: mockProfileName, resourceType: mockResourceTypeURL }],
  };
  const mockUpdatedPreferredProfiles = [
    ...mockPreferredProfiles,
    { id: mockProfileId, name: mockProfileName, resourceType: mockResourceTypeURL },
  ];

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useNavigationState,
        state: {
          queryParams: mockQueryParams,
        },
      },
      {
        store: useStatusState,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
      {
        store: useLoadingState,
        state: {
          setIsLoading: mockSetIsLoading,
        },
      },
      {
        store: useProfileState,
        state: {
          preferredProfiles: mockPreferredProfiles,
          availableProfiles: mockAvailableProfiles,
          setPreferredProfiles: mockSetPreferredProfiles,
        },
      },
    ]);

    (useNavigateToEditPage as jest.Mock).mockReturnValue({
      navigateToEditPage: mockNavigateToEditPage,
    });

    (useRecordControls as jest.Mock).mockReturnValue({
      changeRecordProfile: mockChangeRecordProfile,
    });

    (generatePageURL as jest.Mock).mockReturnValue(mockGeneratedURL);

    (getProfileNameById as jest.Mock).mockReturnValue(mockProfileName);
    (createUpdatedPreferredProfiles as jest.Mock).mockReturnValue(mockUpdatedPreferredProfiles);
  });

  describe('handleSubmit', () => {
    test('saves preferred profile when isDefault is true', async () => {
      (savePreferredProfile as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(savePreferredProfile).toHaveBeenCalledWith(mockProfileId, mockResourceTypeURL);
    });

    test('calls helper functions and updates preferred profiles state when isDefault is true', async () => {
      (savePreferredProfile as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(getProfileNameById).toHaveBeenCalledWith({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: mockAvailableProfiles,
      });

      expect(createUpdatedPreferredProfiles).toHaveBeenCalledWith({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: mockPreferredProfiles,
      });

      expect(mockSetPreferredProfiles).toHaveBeenCalledWith(mockUpdatedPreferredProfiles);
    });

    test('sets loading state during preferred profile save operation', async () => {
      (savePreferredProfile as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    test('skips saving preferred profile when resourceTypeURL is not provided', async () => {
      const { result } = renderHook(() =>
        useProfileSelectionActions({
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(savePreferredProfile).not.toHaveBeenCalled();
      expect(getProfileNameById).not.toHaveBeenCalled();
      expect(createUpdatedPreferredProfiles).not.toHaveBeenCalled();
      expect(mockSetPreferredProfiles).not.toHaveBeenCalled();
    });

    test('handles error when saving preferred profile fails', async () => {
      const mockError = new Error('Failed to save preferred profile');
      (savePreferredProfile as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(savePreferredProfile).toHaveBeenCalledWith(mockProfileId, mockResourceTypeURL);
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.error,
        'ld.error.profileSaveAsPreferred',
      );
      expect(getProfileNameById).not.toHaveBeenCalled();
      expect(createUpdatedPreferredProfiles).not.toHaveBeenCalled();
      expect(mockSetPreferredProfiles).not.toHaveBeenCalled();
    });

    test('navigates to create resource page when action is "set"', async () => {
      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, false);
      });

      expect(generatePageURL).toHaveBeenCalledWith({
        url: ROUTES.RESOURCE_CREATE.uri,
        queryParams: mockQueryParams,
        profileId: mockProfileId,
      });
      expect(mockNavigateToEditPage).toHaveBeenCalledWith(mockGeneratedURL);
      expect(mockResetModalState).toHaveBeenCalled();
    });

    test('changes record profile when action is "change"', async () => {
      mockChangeRecordProfile.mockResolvedValue({});

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'change',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, false);
      });

      expect(mockChangeRecordProfile).toHaveBeenCalledWith({ profileId: mockProfileId });
      expect(mockResetModalState).toHaveBeenCalled();
    });

    test('handles error when changing record profile fails', async () => {
      const mockError = new Error('Failed to change profile');
      mockChangeRecordProfile.mockRejectedValue(mockError);

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'change',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, false);
      });

      expect(mockChangeRecordProfile).toHaveBeenCalledWith({ profileId: mockProfileId });
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.error.profileChange');
      expect(mockResetModalState).toHaveBeenCalled();
    });

    test('performs both saving preferred profile and create resource when isDefault is true and action is "set"', async () => {
      (savePreferredProfile as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'set',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(savePreferredProfile).toHaveBeenCalledWith(mockProfileId, mockResourceTypeURL);
      expect(getProfileNameById).toHaveBeenCalledWith({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: mockAvailableProfiles,
      });
      expect(createUpdatedPreferredProfiles).toHaveBeenCalledWith({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: mockPreferredProfiles,
      });
      expect(mockSetPreferredProfiles).toHaveBeenCalledWith(mockUpdatedPreferredProfiles);
      expect(generatePageURL).toHaveBeenCalledWith({
        url: ROUTES.RESOURCE_CREATE.uri,
        queryParams: mockQueryParams,
        profileId: mockProfileId,
      });
      expect(mockNavigateToEditPage).toHaveBeenCalledWith(mockGeneratedURL);
      expect(mockResetModalState).toHaveBeenCalled();
    });

    test('performs both saving preferred profile and changing profile when isDefault is true and action is "change"', async () => {
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      mockChangeRecordProfile.mockResolvedValue({});

      const { result } = renderHook(() =>
        useProfileSelectionActions({
          resourceTypeURL: mockResourceTypeURL,
          action: 'change',
          resetModalState: mockResetModalState,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit(mockProfileId, true);
      });

      expect(savePreferredProfile).toHaveBeenCalledWith(mockProfileId, mockResourceTypeURL);
      expect(getProfileNameById).toHaveBeenCalledWith({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: mockAvailableProfiles,
      });
      expect(createUpdatedPreferredProfiles).toHaveBeenCalledWith({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: mockPreferredProfiles,
      });
      expect(mockSetPreferredProfiles).toHaveBeenCalledWith(mockUpdatedPreferredProfiles);
      expect(mockChangeRecordProfile).toHaveBeenCalledWith({ profileId: mockProfileId });
      expect(mockResetModalState).toHaveBeenCalled();
    });
  });
});
