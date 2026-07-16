import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';

import {
  createProfileSettings,
  savePreferredProfile,
  savePreferredProfileSettings,
  saveProfileSettings,
} from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState } from '@/store';

import { useSaveProfileSettings } from './useSaveProfileSettings';

jest.mock('@/common/api/profiles.api', () => ({
  deletePreferredProfile: jest.fn(),
  savePreferredProfile: jest.fn(),
  saveProfileSettings: jest.fn(),
  createProfileSettings: jest.fn(),
  savePreferredProfileSettings: jest.fn(),
}));
jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
};

describe('useSaveProfileSettings', () => {
  describe('saveSettings', () => {
    const mockSetIsLoading = jest.fn();
    const mockAddStatusMessagesItem = jest.fn();

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('shows an error when saving preferred profile fails', async () => {
      const error = new Error('Failed to save preferred profiles');
      (savePreferredProfile as jest.Mock).mockRejectedValue(error);
      (createProfileSettings as jest.Mock).mockResolvedValue({ id: 'meta-one' });

      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
          },
        },
        {
          store: useStatusState,
          state: {
            addStatusMessagesItem: mockAddStatusMessagesItem,
          },
        },
      ]);

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
    });

    it('shows an error when saving profile settings fails', async () => {
      const error = new Error('Failed to save profile settings');
      (createProfileSettings as jest.Mock).mockRejectedValue(error);

      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
          },
        },
        {
          store: useStatusState,
          state: {
            addStatusMessagesItem: mockAddStatusMessagesItem,
          },
        },
      ]);

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
    });

    it('shows a specific error for non-unique names', async () => {
      const error = { errors: [{ code: 'profile_settings_name_not_unique' }] } as ApiError;
      (createProfileSettings as jest.Mock).mockRejectedValue(error);

      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
          },
        },
        {
          store: useStatusState,
          state: {
            addStatusMessagesItem: mockAddStatusMessagesItem,
          },
        },
      ]);

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.error,
        'ld.profile_settings_name_not_unique',
      );
    });

    it('shows a specific error for blank names', async () => {
      const error = { errors: [{ code: 'must not be blank' }] } as ApiError;
      (createProfileSettings as jest.Mock).mockRejectedValue(error);

      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
          },
        },
        {
          store: useStatusState,
          state: {
            addStatusMessagesItem: mockAddStatusMessagesItem,
          },
        },
      ]);

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.error,
        'ld.error.profileSettingsNameNotBlank',
      );
    });

    it('updates an existing profile setting', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
            isCreating: false,
            selectedProfileSettingsMeta: {
              id: 'thing',
              name: 'settings-thing',
            },
            settingsName: 'settings-thing',
          },
        },
      ]);

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(saveProfileSettings).toHaveBeenCalledWith('another', 'thing', {
        active: false,
        children: [],
        name: 'settings-thing',
        profileId: 'another',
      });
    });

    it('updates preferred profile setting', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
            isCreating: false,
            isPreferredProfileSettings: true,
            selectedProfileSettingsMeta: {
              id: 44,
              profileId: 'another',
              name: 'settings-thing',
            },
            settingsName: 'settings-thing',
          },
        },
      ]);

      const { queryClient, wrapper } = createWrapper();
      queryClient.setQueryData(['preferredProfileSettings', 'another'], []);

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(savePreferredProfileSettings).toHaveBeenCalledWith('another', 44);
    });

    it('shows loading at start and removes it at end', async () => {
      setInitialGlobalState([
        {
          store: useLoadingState,
          state: {
            setIsLoading: mockSetIsLoading,
          },
        },
        {
          store: useProfileState,
          state: {
            preferredProfiles: [],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'another',
              name: 'another',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: false,
          },
        },
      ]);
      (createProfileSettings as jest.Mock).mockResolvedValue({ id: 'meta-one' });

      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockSetIsLoading).toHaveBeenCalledTimes(2);
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenLastCalledWith(false);
    });
  });
});
