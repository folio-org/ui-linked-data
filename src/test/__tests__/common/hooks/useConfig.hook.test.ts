import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
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

  const mockUseGlobalState = (profiles: ProfileEntry[] = []) => {
    setUpdatedGlobalState([
      {
        store: useProfileStore,
        updatedState: { profiles },
      },
    ]);
  };

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

    test('calls fetchProfile and returns a profile', async () => {
      const mockProfile = [{ id: 'Monograph' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
      mockUseGlobalState();

      const { result } = renderHook(useConfig);
      const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfile).toHaveBeenCalled();
      expect(setSelectedProfile).toHaveBeenCalledWith(mockProfile);
      expect(resultProfiles).toEqual(mockProfile);
    });
  });
});
