import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
import { renderHook } from '@testing-library/react';
import { useConfig } from '@common/hooks/useConfig.hook';
import { fetchProfiles } from '@common/api/profiles.api';
import * as SchemaService from '@common/services/schema';
import { useInputsStore, useProfileStore } from '@src/store';
import CUSTOM_PROFILE_MONOGRAPH from '@src/data/customProfile.json';

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
  fetchProfiles: jest.fn(),
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
jest.mock('@common/hooks/useProcessedRecordAndSchema.hook', () => ({
  useProcessedRecordAndSchema: () => ({
    getProcessedRecordAndSchema: jest.fn(),
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
          previewContent: {},
          selectedEntries: [],
          setUserValues,
          setSelectedEntries,
          setPreviewContent,
          setSelectedRecordBlocks,
        },
      },
    ]);

    (SchemaService.SchemaGeneratorService as jest.Mock).mockImplementation(() => ({ generate: jest.fn() }));
  });

  describe('getProfiles', () => {
    const record = {
      resource: {},
    } as RecordEntry;

    test('returns CUSTOM_PROFILE_MONOGRAPH and does not call fetchProfiles', async () => {
      mockUseGlobalState();

      const { result } = renderHook(useConfig);
      const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setProfiles).not.toHaveBeenCalled();
      expect(resultProfiles).toEqual(CUSTOM_PROFILE_MONOGRAPH);
    });
  });
});
