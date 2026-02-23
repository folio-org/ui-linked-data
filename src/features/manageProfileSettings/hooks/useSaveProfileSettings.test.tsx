import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';

import { savePreferredProfile, saveProfileSettings } from '@/common/api/profiles.api';

import { useLoadingState, useManageProfileSettingsState, useProfileState, useStatusState } from '@/store';

import { useSaveProfileSettings } from './useSaveProfileSettings';

jest.mock('@/common/api/profiles.api', () => ({
  deletePreferredProfile: jest.fn(),
  savePreferredProfile: jest.fn(),
  saveProfileSettings: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSaveProfilesettings', () => {
  describe('saveSettings', () => {
    const mockSetIsLoading = jest.fn();
    const mockAddStatusMessagesItem = jest.fn();

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('shows an error when saving preferred profile fails', async () => {
      const error = new Error('Failed to save preferred profiles');
      (savePreferredProfile as jest.Mock).mockRejectedValue(error);

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

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
    });

    it('shows an error when saving profile settings fails', async () => {
      const error = new Error('Failed to save profile settings');
      (saveProfileSettings as jest.Mock).mockRejectedValue(error);

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

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
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

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(mockSetIsLoading).toHaveBeenCalledTimes(2);
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenLastCalledWith(false);
    });
  });
});
