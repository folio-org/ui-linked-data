import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { renderHook } from '@testing-library/react';
import { useLoadProfileSettings } from '@common/hooks/useLoadProfileSettings';
import { fetchProfileSettings } from '@common/api/profiles.api';
import { useProfileStore } from '@src/store';
import { detectDrift } from '@common/helpers/profileSettingsDrift.helper';
import { DEFAULT_INACTIVE_SETTINGS } from '@common/constants/profileSettings.constants';

jest.mock('@common/api/profiles.api', () => ({
  fetchProfileSettings: jest.fn(),
}));
jest.mock('@common/helpers/profileSettingsDrift.helper', () => ({
  detectDrift: jest.fn(),
}));

describe('useLoadProfileSettings', () => {
  const setProfileSettings = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          profileSettings: {},
          setProfileSettings,
        },
      },
    ]);
  });

  describe('loadProfileSettings', () => {
    test('returns default settings when no profile ID defined', async () => {
      const profile = [] as Profile;

      const { result } = renderHook(useLoadProfileSettings);
      const settings = await result.current.loadProfileSettings(undefined, profile);

      expect(settings).toBe(DEFAULT_INACTIVE_SETTINGS);
      expect(fetchProfileSettings).not.toHaveBeenCalled();
      expect(setProfileSettings).not.toHaveBeenCalled();
    });

    test('returns cached settings when it exists', async () => {
      const cachedSettings = {
        active: true,
        children: [],
        missingFromSettings: [],
      };
      const profile = [] as Profile;
      setInitialGlobalState([
        {
          store: useProfileStore,
          state: {
            profileSettings: { 1: cachedSettings },
            setProfileSettings,
          },
        },
      ]);

      const { result } = renderHook(useLoadProfileSettings);
      const settings = await result.current.loadProfileSettings(1, profile);

      expect(settings).toBe(cachedSettings);
      expect(fetchProfileSettings).not.toHaveBeenCalled();
      expect(setProfileSettings).not.toHaveBeenCalled();
    });

    test('fetches and caches profile settings when it does not exist', async () => {
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

      const { result } = renderHook(useLoadProfileSettings);
      const settings = await result.current.loadProfileSettings(1, profile);

      expect(settings).toBe(newProfileSettingsWithDrift);
      expect(fetchProfileSettings).toHaveBeenCalledWith(1);
      expect(setProfileSettings).toHaveBeenCalledWith(expect.any(Function));

      // Verify the profile settings are updated correctly
      const setProfileSettingsCallback = setProfileSettings.mock.calls[0][0];
      const newState = await setProfileSettingsCallback({});
      expect(newState).toEqual({ 1: newProfileSettingsWithDrift });
    });

    test('handles error from fetchProfileSettings', async () => {
      const error = new Error('Failed to fetch profile settings');
      const profile = [] as Profile;
      (fetchProfileSettings as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(useLoadProfileSettings);

      await expect(result.current.loadProfileSettings(1, profile)).rejects.toThrow('Failed to fetch profile settings');
      expect(fetchProfileSettings).toHaveBeenCalledWith(1);
      expect(setProfileSettings).not.toHaveBeenCalled();
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

        const { result } = renderHook(useLoadProfileSettings);
        const settings = await result.current.loadProfileSettings(1, profile);
        expect(settings.children).toEqual(expected);
      });
    });
  });
});
