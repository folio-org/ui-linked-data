import { act, renderHook } from '@testing-library/react';

import { fetchProfiles } from '@/common/api/profiles.api';
import * as BibframeConstants from '@/common/constants/bibframe.constants';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useProfileState } from '@/store';

import { useProfileList } from './useProfileList';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
}));

const mockTypeUris = {
  'one-resource-type': 'one-uri',
  'two-resource-type': 'two-uri',
  'three-resource-type': 'three-uri',
};
const mockImportedConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
mockImportedConstant(mockTypeUris);

describe('useProfileList', () => {
  const setAvailableProfiles = jest.fn();

  const resourceTypeURL = 'test-resource-type' as ResourceTypeURL;
  const profileId = 'test-profile-id';
  const mockProfiles = [
    {
      id: profileId,
      name: 'Test Profile',
      resourceType: resourceTypeURL,
    },
    {
      id: 'other-profile',
      name: 'Other Profile',
      resourceType: resourceTypeURL,
    },
  ];

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useProfileState,
        state: {
          availableProfiles: null,
          setAvailableProfiles,
        },
      },
    ]);
  });

  describe('loadAvailableProfiles', () => {
    it('handles empty profiles list', async () => {
      (fetchProfiles as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useProfileList());
      await act(async () => {
        await result.current.loadAvailableProfiles(resourceTypeURL);
      });

      expect(fetchProfiles).toHaveBeenCalled();
      expect(setAvailableProfiles).toHaveBeenCalled();
    });

    it('stores fetched profiles when none stored previously', async () => {
      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileList());
      let returnedProfiles;
      await act(async () => {
        returnedProfiles = await result.current.loadAvailableProfiles(resourceTypeURL);
      });

      expect(fetchProfiles).toHaveBeenCalled();
      expect(setAvailableProfiles).toHaveBeenCalled();
      expect(returnedProfiles).toEqual(mockProfiles);
    });

    it('skips fetching resource type profiles if previously fetched', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            availableProfiles: {
              [resourceTypeURL]: mockProfiles,
            },
            setAvailableProfiles,
          },
        },
      ]);

      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileList());
      let returnedProfiles;
      await act(async () => {
        returnedProfiles = await result.current.loadAvailableProfiles(resourceTypeURL);
      });

      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setAvailableProfiles).not.toHaveBeenCalled();
      expect(returnedProfiles).toEqual(mockProfiles);
    });

    it('throws on fetch error', async () => {
      const error = new Error('Failed to load profiles');
      (fetchProfiles as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useProfileList());
      await act(async () => {
        expect(result.current.loadAvailableProfiles(resourceTypeURL)).rejects.toThrow('Failed to load profiles');
      });

      expect(fetchProfiles).toHaveBeenCalled();
      expect(setAvailableProfiles).not.toHaveBeenCalled();
    });
  });

  describe('loadAllAvailableProfiles', () => {
    it('loads all profiles when none were previously loaded', async () => {
      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileList());
      await act(async () => {
        await result.current.loadAllAvailableProfiles();
      });

      expect(fetchProfiles).toHaveBeenCalledTimes(3);
      expect(setAvailableProfiles).toHaveBeenCalledTimes(3);
    });

    it('loads some profiles when only some were previously loaded', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            availableProfiles: {
              'three-uri': mockProfiles,
            },
            setAvailableProfiles,
          },
        },
      ]);

      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileList());
      await act(async () => {
        await result.current.loadAllAvailableProfiles();
      });

      expect(fetchProfiles).toHaveBeenCalledTimes(2);
      expect(setAvailableProfiles).toHaveBeenCalledTimes(2);
    });

    it('loads no profiles when all were previously loaded', async () => {
      setInitialGlobalState([
        {
          store: useProfileState,
          state: {
            availableProfiles: {
              'one-uri': mockProfiles,
              'two-uri': mockProfiles,
              'three-uri': mockProfiles,
            },
            setAvailableProfiles,
          },
        },
      ]);

      (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);

      const { result } = renderHook(() => useProfileList());
      await act(async () => {
        await result.current.loadAllAvailableProfiles();
      });

      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setAvailableProfiles).not.toHaveBeenCalled();
    });
  });
});
