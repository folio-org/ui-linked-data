import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useLoadProfileSettings } from '@common/hooks/useLoadProfileSettings';
import { fetchProfileSettings } from '@common/api/profiles.api';
import { detectDrift } from '@common/helpers/profileSettingsDrift.helper';
import { DEFAULT_INACTIVE_SETTINGS } from '@common/constants/profileSettings.constants';
import { useStatusState } from '@src/store';

jest.mock('@common/api/profiles.api', () => ({
  fetchProfileSettings: jest.fn(),
}));
jest.mock('@common/helpers/profileSettingsDrift.helper', () => ({
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

    describe('settings sorting', () => {
      test.each([
        ['visibility and order both undefined', [{ id: 'a' }, { id: 'b' }], [{ id: 'a' }, { id: 'b' }]],
        [
          'visible and defined in first only',
          [{ id: 'a' }, { id: 'b', visible: true }],
          [{ id: 'b', visible: true }, { id: 'a' }],
        ],
        [
          'visible and defined in second only',
          [{ id: 'a', visible: true }, { id: 'b' }],
          [{ id: 'a', visible: true }, { id: 'b' }],
        ],
        [
          'visible and defined in both',
          [
            { id: 'a', visible: true },
            { id: 'b', visible: true },
          ],
          [
            { id: 'a', visible: true },
            { id: 'b', visible: true },
          ],
        ],
        [
          'hidden in first and defined in both',
          [
            { id: 'a', visible: false },
            { id: 'b', visible: true },
          ],
          [
            { id: 'b', visible: true },
            { id: 'a', visible: false },
          ],
        ],
        [
          'hidden in second and defined in both',
          [
            { id: 'a', visible: true },
            { id: 'b', visible: false },
          ],
          [
            { id: 'a', visible: true },
            { id: 'b', visible: false },
          ],
        ],
        [
          'hidden in both',
          [
            { id: 'a', visible: false },
            { id: 'b', visible: false },
          ],
          [
            { id: 'a', visible: false },
            { id: 'b', visible: false },
          ],
        ],
        [
          'order only in first',
          [
            { id: 'a', visible: true, order: 1 },
            { id: 'b', visible: true },
          ],
          [
            { id: 'a', visible: true, order: 1 },
            { id: 'b', visible: true },
          ],
        ],
        [
          'order only in second',
          [
            { id: 'a', visible: true },
            { id: 'b', visible: true, order: 1 },
          ],
          [
            { id: 'b', visible: true, order: 1 },
            { id: 'a', visible: true },
          ],
        ],
        [
          'order in both',
          [
            { id: 'a', visible: true, order: 1 },
            { id: 'b', visible: true, order: 2 },
          ],
          [
            { id: 'a', visible: true, order: 1 },
            { id: 'b', visible: true, order: 2 },
          ],
        ],
        [
          'opposite ordering',
          [
            { id: 'a', visible: true, order: 2 },
            { id: 'b', visible: true, order: 1 },
          ],
          [
            { id: 'b', visible: true, order: 1 },
            { id: 'a', visible: true, order: 2 },
          ],
        ],
      ])('%s', async (_name, settingsChildren, expected) => {
        const profile = [] as Profile;
        const settingsInput = {
          active: true,
          children: settingsChildren,
        };
        const settingsWithDrift = {
          ...settingsInput,
          missingFromSettings: [],
        };
        (fetchProfileSettings as jest.Mock).mockResolvedValue(settingsInput);
        (detectDrift as jest.Mock).mockReturnValue(settingsWithDrift);

        const { result } = renderHook(useLoadProfileSettings, { wrapper: createWrapper() });
        const settings = await result.current.loadProfileSettings(1, profile);
        expect(settings.children).toEqual(expected);
      });
    });
  });
});
