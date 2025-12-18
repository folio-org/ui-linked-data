import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { renderHook } from '@testing-library/react';
import { useConfig } from '@common/hooks/useConfig.hook';
import { fetchProfile, fetchProfileSettings } from '@common/api/profiles.api';
import { useInputsStore, useProfileStore } from '@src/store';
import { getProfileConfig } from '@common/helpers/profile.helper';

const lookupCacheService = jest.fn();
const commonStatusService = jest.fn();

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));
jest.mock('@common/helpers/profile.helper', () => ({
  ...jest.requireActual('@common/helpers/profile.helper'),
  getProfileConfig: jest.fn(),
}));
jest.mock('@common/services/schema');
jest.mock('@common/hooks/useLookupCache.hook', () => ({
  useLookupCacheService: () => lookupCacheService,
}));
jest.mock('@common/hooks/useCommonStatus', () => ({
  useCommonStatus: () => commonStatusService,
}));
jest.mock('@common/api/profiles.api', () => ({
  fetchProfile: jest.fn(),
  fetchProfileSettings: jest.fn(),
}));
jest.mock('@common/api/client', () => ({
  apiClient: jest.fn(),
}));
jest.mock('@common/services/userValues', () => ({
  UserValuesService: jest.fn(),
}));
jest.mock('@common/helpers/record.helper', () => ({
  ...jest.requireActual('@common/helpers/record.helper'),
  getRecordTitle: jest.fn(),
  getPrimaryEntitiesFromRecord: jest.fn(),
}));
jest.mock('@common/helpers/recordFormatting.helper', () => ({
  getReferenceIdsRaw: jest.fn().mockReturnValue([]),
}));
jest.mock('@common/hooks/useProcessedRecordAndSchema.hook', () => ({
  useProcessedRecordAndSchema: () => ({
    getProcessedRecordAndSchema: jest.fn().mockResolvedValue({
      updatedSchema: {},
      updatedUserValues: {},
      selectedRecordBlocks: {},
    }),
  }),
}));

describe('useConfig', () => {
  const setProfiles = jest.fn();
  const setSelectedProfile = jest.fn();
  const setUserValues = jest.fn();
  const setPreparedFields = jest.fn();
  const setSchema = jest.fn();
  const setInitialSchemaKey = jest.fn();
  const setSelectedEntries = jest.fn();
  const setPreviewContent = jest.fn();
  const setSelectedRecordBlocks = jest.fn();
  const setSearchParams = jest.fn();
  const setProfileSettings = jest.fn();

  const mockProfileConfig = {
    ids: [],
    rootEntry: { id: 'root' },
  };

  const mockProfileSettings = {
    active: false,
    children: [],
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          profiles: [],
          setProfiles,
          selectedProfile: {},
          setSelectedProfile,
          preparedFields: {},
          setPreparedFields,
          schema: {},
          setSchema,
          initialSchemaKey: '',
          setInitialSchemaKey,
          profileSettings: {},
          setProfileSettings,
        },
      },
      {
        store: useInputsStore,
        state: {
          userValues: {},
          previewContent: [],
          selectedEntries: [],
          setUserValues,
          setSelectedEntries,
          setPreviewContent,
          setSelectedRecordBlocks,
        },
      },
    ]);

    (getProfileConfig as jest.Mock).mockReturnValue(mockProfileConfig);
    (fetchProfileSettings as jest.Mock).mockReturnValue(mockProfileSettings);
  });

  describe('getProfiles', () => {
    const record = {
      resource: {},
    } as RecordEntry;

    test('calls fetchProfile and sets profile', async () => {
      const mockProfile = [{ id: 'Monograph' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
      const mockQueryParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([mockQueryParams, setSearchParams]);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['1'],
      });

      const { result } = renderHook(useConfig);
      await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfile).toHaveBeenCalled();
      expect(setSelectedProfile).toHaveBeenCalledWith([{ id: 'root' }, ...mockProfile]);
    });

    test('loads single profile when no rootEntry is provided', async () => {
      const mockProfileResult = [{ id: 'SingleProfile' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfileResult);
      const mockQueryParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([mockQueryParams, setSearchParams]);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ids: ['1'],
      });

      const { result } = renderHook(useConfig);
      await result.current.getProfiles({
        record,
        recordId: '',
      });

      expect(setSelectedProfile).toHaveBeenCalledWith(mockProfileResult);
    });

    test('combines rootEntry with loaded profiles when rootEntry is provided', async () => {
      const mockProfileResult1 = { id: 'Profile1' };
      const mockProfileResult2 = { id: 'Profile2' };
      const rootEntry = { id: 'RootProfile' } as ProfileNode;
      const mockQueryParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([mockQueryParams, setSearchParams]);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['1', '2'],
        rootEntry,
      });

      (fetchProfile as jest.Mock).mockResolvedValueOnce(mockProfileResult1).mockResolvedValueOnce(mockProfileResult2);

      const { result } = renderHook(useConfig);
      await result.current.getProfiles({
        record,
        recordId: '',
      });

      expect(setSelectedProfile).toHaveBeenCalledWith([rootEntry, mockProfileResult1, mockProfileResult2]);
    });
  });
});
