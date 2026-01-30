import '@/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { fetchProfile } from '@/common/api/profiles.api';
import { useLoadProfile } from '@/common/hooks/useLoadProfile';

import { useProfileStore } from '@/store';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfile: jest.fn(),
}));

describe('useLoadProfile', () => {
  const setProfiles = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          profiles: {},
          setProfiles,
        },
      },
    ]);
  });

  describe('loadProfile', () => {
    test('returns cached profile when it exists', async () => {
      const cachedProfile = { id: 'cached-profile' };
      setInitialGlobalState([
        {
          store: useProfileStore,
          state: {
            profiles: { 1: cachedProfile },
            setProfiles,
          },
        },
      ]);

      const { result } = renderHook(useLoadProfile);
      const profile = await result.current.loadProfile(1);

      expect(profile).toBe(cachedProfile);
      expect(fetchProfile).not.toHaveBeenCalled();
      expect(setProfiles).not.toHaveBeenCalled();
    });

    test('fetches and caches profile when it does not exist', async () => {
      const newProfile = { id: 'new-profile' };
      (fetchProfile as jest.Mock).mockResolvedValue(newProfile);

      const { result } = renderHook(useLoadProfile);
      const profile = await result.current.loadProfile(1);

      expect(profile).toBe(newProfile);
      expect(fetchProfile).toHaveBeenCalledWith(1);
      expect(setProfiles).toHaveBeenCalledWith(expect.any(Function));

      // Verify the profiles are updated correctly
      const setProfilesCallback = setProfiles.mock.calls[0][0];
      const newState = setProfilesCallback({});
      expect(newState).toEqual({ 1: newProfile });
    });

    test('handles error from fetchProfile', async () => {
      const error = new Error('Failed to fetch profile');
      (fetchProfile as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(useLoadProfile);

      await expect(result.current.loadProfile(1)).rejects.toThrow('Failed to fetch profile');
      expect(fetchProfile).toHaveBeenCalledWith(1);
      expect(setProfiles).not.toHaveBeenCalled();
    });
  });
});
