import '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { fetchProfileSettings } from '@/common/api/profiles.api';
import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';
import { detectDrift } from '@/common/helpers/profileSettingsDrift.helper';
import { useLoadProfileSettings } from '@/common/hooks/useLoadProfileSettings';

import { useStatusState } from '@/store';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfileSettings: jest.fn(),
}));
jest.mock('@/common/helpers/profileSettingsDrift.helper', () => ({
  detectDrift: jest.fn(),
}));

describe('useLoadProfileSettings', () => {
  const addStatusMessagesItem = jest.fn();
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useStatusState,
        state: {
          addStatusMessagesItem,
        },
      },
    ]);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  describe('loadProfileSettings', () => {
    test('returns default settings when no profile ID defined', async () => {
      const profile = [] as Profile;

      const { result } = renderHook(useLoadProfileSettings, { wrapper: createWrapper() });
      const settings = await result.current.loadProfileSettings(undefined, profile);

      expect(settings).toBe(DEFAULT_INACTIVE_SETTINGS);
      expect(fetchProfileSettings).not.toHaveBeenCalled();
    });

    test('fetches profile settings', async () => {
      const newProfileSettings = {
        active: true,
        children: [],
      } as ProfileSettings;
      const profile = [] as Profile;
      (fetchProfileSettings as jest.Mock).mockResolvedValue(newProfileSettings);
      const newProfileSettingsWithDrift = {
        ...newProfileSettings,
        missingFromSettings: [],
      };
      (detectDrift as jest.Mock).mockReturnValue(newProfileSettingsWithDrift);

      const { result } = renderHook(useLoadProfileSettings, { wrapper: createWrapper() });
      const settings = await result.current.loadProfileSettings(1, profile);

      expect(settings).toBe(newProfileSettingsWithDrift);
      expect(fetchProfileSettings).toHaveBeenCalledWith(1);
    });

    test('error in fetchProfileSettings returns default settings', async () => {
      const profile = [] as Profile;
      (fetchProfileSettings as jest.Mock).mockRejectedValue('error');

      const { result } = renderHook(useLoadProfileSettings, { wrapper: createWrapper() });
      const settings = await result.current.loadProfileSettings(1, profile);

      expect(settings).toBe(DEFAULT_INACTIVE_SETTINGS);
      expect(fetchProfileSettings).toHaveBeenCalledWith(1);
      expect(addStatusMessagesItem).toHaveBeenCalled();
    });
  });
});
