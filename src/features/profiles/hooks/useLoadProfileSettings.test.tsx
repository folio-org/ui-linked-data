import '@/test/__mocks__/common/hooks/useSchemaPipeline.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { fetchProfileSettings } from '@/common/api/profiles.api';
import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';
import { detectDrift } from '@/common/helpers/profileSettingsDrift.helper';

import { useStatusState } from '@/store';

import { useLoadProfileSettings } from './useLoadProfileSettings';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfileSettings: jest.fn(),
}));
jest.mock('@/common/helpers/profileSettingsDrift.helper', () => ({
  detectDrift: jest.fn(),
}));

const mockInstanceResourceTypeUrl = 'mock-instance-resource-type-url';
const mockWorkResourceTypeUrl = 'mock-work-resource-type-url';

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
      const settings = await result.current.loadProfileSettings(1, undefined, profile);

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
      const settings = await result.current.loadProfileSettings(1, 1, profile);

      expect(settings).toBe(newProfileSettingsWithDrift);
      expect(fetchProfileSettings).toHaveBeenCalledWith(1, 1);
    });

    test('recomputes drift for each resource type while reusing cached settings', async () => {
      const newProfileSettings = {
        active: true,
        children: [],
      } as ProfileSettings;
      const profile = [] as Profile;
      const instanceSettings = {
        ...newProfileSettings,
        resourceTypeURL: mockInstanceResourceTypeUrl,
        missingFromSettings: [],
      } as ProfileSettingsWithDrift;
      const workSettings = {
        ...newProfileSettings,
        resourceTypeURL: mockWorkResourceTypeUrl,
        missingFromSettings: [],
      } as ProfileSettingsWithDrift;

      (fetchProfileSettings as jest.Mock).mockResolvedValue(newProfileSettings);
      (detectDrift as jest.Mock).mockReturnValueOnce(instanceSettings).mockReturnValueOnce(workSettings);

      const { result } = renderHook(useLoadProfileSettings, { wrapper: createWrapper() });
      const first = await result.current.loadProfileSettings(1, 1, profile, mockInstanceResourceTypeUrl);
      const second = await result.current.loadProfileSettings(1, 1, profile, mockWorkResourceTypeUrl);

      expect(first).toBe(instanceSettings);
      expect(second).toBe(workSettings);
      expect(fetchProfileSettings).toHaveBeenCalledTimes(1);
      expect(detectDrift).toHaveBeenNthCalledWith(1, profile, newProfileSettings, mockInstanceResourceTypeUrl);
      expect(detectDrift).toHaveBeenNthCalledWith(2, profile, newProfileSettings, mockWorkResourceTypeUrl);
    });

    test('error in fetchProfileSettings returns default settings', async () => {
      const profile = [] as Profile;
      (fetchProfileSettings as jest.Mock).mockRejectedValue('error');

      const { result } = renderHook(useLoadProfileSettings, { wrapper: createWrapper() });
      const settings = await result.current.loadProfileSettings(1, 1, profile);

      expect(settings).toBe(DEFAULT_INACTIVE_SETTINGS);
      expect(fetchProfileSettings).toHaveBeenCalledWith(1, 1);
      expect(addStatusMessagesItem).toHaveBeenCalled();
    });
  });
});
