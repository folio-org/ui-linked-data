import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';

import { deletePreferredProfile, savePreferredProfile, saveProfileSettings } from '@/common/api/profiles.api';

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

    it('skips saving preferred profile when none were set before and not selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
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
              id: 'select',
              name: 'Select',
              resourceType: 'irrelevant',
            },
            isTypeDefaultProfile: false,
          },
        },
      ]);

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(savePreferredProfile).not.toHaveBeenCalled();
      expect(deletePreferredProfile).not.toHaveBeenCalled();
    });

    it('skips saving preferred profile when previously set to this and still selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [
              {
                id: 'prefer',
                name: 'prefer',
                resourceType: 'for-type',
              },
            ],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'prefer',
              name: 'prefer',
              resourceType: 'for-type',
            },
            isTypeDefaultProfile: true,
          },
        },
      ]);

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(savePreferredProfile).not.toHaveBeenCalled();
      expect(deletePreferredProfile).not.toHaveBeenCalled();
    });

    it('skips saving preferred profile when previously set to another and not selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [
              {
                id: 'prefer',
                name: 'prefer',
                resourceType: 'for-type',
              },
            ],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'different',
              name: 'different',
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

      expect(savePreferredProfile).not.toHaveBeenCalled();
      expect(deletePreferredProfile).not.toHaveBeenCalled();
    });

    it('saves preferred profile when previously set to another and selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [
              {
                id: 'prefer',
                name: 'prefer',
                resourceType: 'for-type',
              },
            ],
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
      ]);

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(savePreferredProfile).toHaveBeenCalled();
      expect(deletePreferredProfile).not.toHaveBeenCalled();
    });

    it('saves preferred profile when not previously set and selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
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
      ]);

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(savePreferredProfile).toHaveBeenCalled();
      expect(deletePreferredProfile).not.toHaveBeenCalled();
    });

    it('deletes preferred profile when previously set to this and not selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: [
              {
                id: 'prefer',
                name: 'prefer',
                resourceType: 'for-type',
              },
            ],
          },
        },
        {
          store: useManageProfileSettingsState,
          state: {
            selectedProfile: {
              id: 'prefer',
              name: 'prefer',
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

      expect(savePreferredProfile).not.toHaveBeenCalled();
      expect(deletePreferredProfile).toHaveBeenCalled();
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

    it('generates expected settings from selected and unused components', async () => {
      (saveProfileSettings as jest.Mock).mockResolvedValue({});
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
              id: 'select',
              name: 'Select',
              resourceType: 'irrelevant',
            },
            isTypeDefaultProfile: false,
            isSettingsActive: true,
            unusedComponents: [
              {
                id: 'unused-1',
                name: 'unused-1',
                mandatory: false,
              },
            ],
            selectedComponents: [
              {
                id: 'selected-1',
                name: 'selected-1',
                mandatory: true,
              },
              {
                id: 'selected-2',
                name: 'selected-2',
                mandatory: false,
              },
            ],
          },
        },
      ]);

      const { result } = renderHook(() => useSaveProfileSettings(), { wrapper: createWrapper() });
      await act(async () => {
        await result.current.saveSettings();
      });

      expect(saveProfileSettings).toHaveBeenCalledWith('select', {
        active: true,
        children: [
          {
            id: 'selected-1',
            visible: true,
            order: 1,
          },
          {
            id: 'selected-2',
            visible: true,
            order: 2,
          },
          {
            id: 'unused-1',
            visible: false,
            order: 3,
          },
        ],
      });
    });
  });
});
