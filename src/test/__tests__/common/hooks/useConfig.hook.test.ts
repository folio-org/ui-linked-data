import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { renderHook } from '@testing-library/react';
import { useConfig } from '@common/hooks/useConfig.hook';
import { fetchProfile } from '@common/api/profiles.api';
import { useInputsStore, useProfileStore } from '@src/store';

const lookupCacheService = jest.fn();
const commonStatusService = jest.fn();

jest.mock('@common/services/schema');
jest.mock('@common/hooks/useLookupCache.hook', () => ({
  useLookupCacheService: () => lookupCacheService,
}));
jest.mock('@common/hooks/useCommonStatus', () => ({
  useCommonStatus: () => commonStatusService,
}));
jest.mock('@common/api/profiles.api', () => ({
  fetchProfile: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  describe('getProfiles', () => {
    const record = {
      resource: {},
    } as RecordEntry;

    test('calls fetchProfile and sets profile', async () => {
      const mockProfile = [{ id: 'Monograph' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);

      const { result } = renderHook(useConfig);
      await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfile).toHaveBeenCalled();
      expect(setSelectedProfile).toHaveBeenCalledWith(mockProfile);
    });

    test('loads single profile when no rootEntry is provided', async () => {
      const mockProfileResult = { id: 'SingleProfile' };
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfileResult);

      const { result } = renderHook(useConfig);
      await result.current.getProfiles({
        record,
        recordId: '',
        profile: {
          ids: [1],
        },
      });

      expect(setSelectedProfile).toHaveBeenCalledWith(mockProfileResult);
    });

    test('combines rootEntry with loaded profiles when rootEntry is provided', async () => {
      const mockProfileResult1 = { id: 'Profile1' };
      const mockProfileResult2 = { id: 'Profile2' };
      const rootEntry = { id: 'RootProfile' } as ProfileNode;

      (fetchProfile as jest.Mock).mockResolvedValueOnce(mockProfileResult1).mockResolvedValueOnce(mockProfileResult2);

      const { result } = renderHook(useConfig);
      await result.current.getProfiles({
        record,
        recordId: '',
        profile: {
          ids: [1, 2],
          rootEntry,
        },
      });

      expect(setSelectedProfile).toHaveBeenCalledWith([rootEntry, mockProfileResult1, mockProfileResult2]);
    });
  });
});
