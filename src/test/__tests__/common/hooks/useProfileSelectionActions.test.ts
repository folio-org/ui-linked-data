import { renderHook, act } from '@testing-library/react';
import { useProfileSelectionActions } from '@common/hooks/useProfileSelectionActions';
import { savePreferredProfile } from '@common/api/profiles.api';
import { generatePageURL } from '@common/helpers/navigation.helper';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useNavigationState, useStatusState } from '@src/store';
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

describe('useProfileSelectionActions', () => {
  const mockResetModalState = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();
  const mockNavigateToEditPage = jest.fn();
  const mockChangeRecordProfile = jest.fn();
  const mockQueryParams = { param: 'value' };
  const mockProfileId = 'profile-123';
  const mockResourceTypeURL = 'test-resource-type';
  const mockGeneratedURL = '/generated-url';

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
    ]);

    (useNavigateToEditPage as jest.Mock).mockReturnValue({
      navigateToEditPage: mockNavigateToEditPage,
    });

    (useRecordControls as jest.Mock).mockReturnValue({
      changeRecordProfile: mockChangeRecordProfile,
    });

    (generatePageURL as jest.Mock).mockReturnValue(mockGeneratedURL);
  });

  /* afterEach(() => {
    jest.resetAllMocks();
  }); */

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
      expect(mockChangeRecordProfile).toHaveBeenCalledWith({ profileId: mockProfileId });
      expect(mockResetModalState).toHaveBeenCalled();
    });
  });
});
