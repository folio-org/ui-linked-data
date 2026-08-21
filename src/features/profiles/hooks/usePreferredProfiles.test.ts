import { setInitialGlobalState } from '@/test/__mocks__/store';

import { act, renderHook } from '@testing-library/react';

import { fetchPreferredProfiles } from '@/common/api/profiles.api';

import { useProfileState } from '@/store';

import { usePreferredProfiles } from './usePreferredProfiles';

jest.mock('@/common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
}));

describe('usePreferredProfiles', () => {
  const setPreferredProfiles = jest.fn();

  const resourceType = 'test-resource';
  const mockPreferredProfiles = [
    {
      id: 'test-preferred-one',
      name: 'Test Preferred One',
      resourceType: resourceType,
    },
  ] as ProfileDTO[];

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useProfileState,
        state: {
          preferredProfiles: null,
          setPreferredProfiles,
        },
      },
    ]);
  });

  describe('loadPreferredProfiles', () => {
    it('calls API to fetch when not cached', async () => {
      (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockPreferredProfiles);

      const { result } = renderHook(() => usePreferredProfiles());
      let returnedProfiles;
      await act(async () => {
        returnedProfiles = await result.current.loadPreferredProfiles();
      });

      expect(fetchPreferredProfiles).toHaveBeenCalled();
      expect(setPreferredProfiles).toHaveBeenCalledWith(mockPreferredProfiles);
      expect(returnedProfiles).toEqual(mockPreferredProfiles);
    });

    it('skips API call and returns cached profiles when in cache', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: mockPreferredProfiles,
            setPreferredProfiles,
          },
        },
      ]);

      (fetchPreferredProfiles as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => usePreferredProfiles());
      let returnedProfiles;
      await act(async () => {
        returnedProfiles = await result.current.loadPreferredProfiles();
      });

      expect(fetchPreferredProfiles).not.toHaveBeenCalled();
      expect(setPreferredProfiles).not.toHaveBeenCalled();
      expect(returnedProfiles).toEqual(mockPreferredProfiles);
    });
  });

  describe('preferredProfileForType', () => {
    it('uses argument when provided', async () => {
      const argumentProfiles = [
        {
          id: 'arg-1',
          name: 'Argument 1',
          resourceType: resourceType,
        },
      ];

      const { result } = renderHook(() => usePreferredProfiles());
      let profile;
      await act(async () => {
        profile = await result.current.preferredProfileForType(resourceType, argumentProfiles);
      });

      expect(profile).toEqual(argumentProfiles[0]);
    });

    it('checks in cache when no profiles provided', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            preferredProfiles: mockPreferredProfiles,
            setPreferredProfiles,
          },
        },
      ]);

      const { result } = renderHook(() => usePreferredProfiles());
      let profile;
      await act(async () => {
        profile = await result.current.preferredProfileForType(resourceType);
      });

      expect(profile).toEqual(mockPreferredProfiles[0]);
    });

    it('returns null when no cache and no argument', async () => {
      const { result } = renderHook(() => usePreferredProfiles());
      let profile;
      await act(async () => {
        profile = await result.current.preferredProfileForType(resourceType);
      });

      expect(profile).toBeNull();
    });
  });
});
