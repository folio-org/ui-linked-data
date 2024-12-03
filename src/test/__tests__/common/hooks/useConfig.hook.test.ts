import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
import { renderHook } from '@testing-library/react';
import { useSetRecoilState } from 'recoil';
import { useConfig } from '@common/hooks/useConfig.hook';
import { fetchProfiles } from '@common/api/profiles.api';
import * as SchemaService from '@common/services/schema';
import { useProfileStore } from '@src/store';

const profiles = [
  {
    id: 'profileId_1',
    name: 'Profile 1',
    json: {
      Profile: {
        resourceTemplates: [
          {
            id: 'templateId_1',
            name: 'Template 1',
          },
        ],
      },
    },
  },
] as unknown as ProfileEntry[];

const lookupCacheService = jest.fn();
const commonStatusService = jest.fn();

jest.mock('recoil');
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
jest.mock('@state', () => ({
  default: {
    config: {
      selectedEntries: [],
    },
    inputs: {
      userValues: {},
      previewContent: {},
    },
  },
}));
jest.mock('@common/services/userValues', () => ({
  UserValuesService: jest.fn(),
}));
jest.mock('@common/helpers/record.helper', () => ({
  getEditingRecordBlocks: jest.fn(),
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

  const mockUseRecoilState = (profiles: ProfileEntry[] = []) => {
    setUpdatedGlobalState(useProfileStore, { profiles, preparedFields: null });
  };

  beforeEach(() => {
    (useSetRecoilState as jest.Mock)
      .mockReturnValueOnce(setUserValues)
      .mockReturnValueOnce(setSelectedEntries)
      .mockReturnValueOnce(setPreviewContent)
      .mockReturnValueOnce(setSelectedRecordBlocks);

    setInitialGlobalState(useProfileStore, {
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
    });

    (SchemaService.SchemaService as jest.Mock).mockImplementation(() => ({ generate: jest.fn() }));
  });

  test('prepareFields - calls "setPreparedFields" and returns an object with required fields', async () => {
    mockUseRecoilState();
    const testResult = {
      templateId_1: {
        id: 'templateId_1',
        name: 'Template 1',
      },
    };

    const { result } = renderHook(useConfig);
    const preparedFields = result.current.prepareFields(profiles);

    expect(setPreparedFields).toHaveBeenCalledWith(testResult);
    expect(preparedFields).toEqual(testResult);
  });

  describe('getProfiles', () => {
    const record = {
      resource: {},
    } as RecordEntry;

    test('calls "fetchProfiles" and "setProfiles" and returns an array of profiles', async () => {
      mockUseRecoilState();
      (fetchProfiles as jest.Mock).mockImplementation(() => profiles);

      const { result } = renderHook(useConfig);
      const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfiles).toHaveBeenCalled();
      expect(setProfiles).toHaveBeenCalledWith(profiles);
      expect(resultProfiles).toEqual(profiles);
    });

    test('does not call "fetchProfiles" and "setProfiles" and returns a stored array of profiles', async () => {
      mockUseRecoilState(profiles);

      const { result } = renderHook(useConfig);

      const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setProfiles).not.toHaveBeenCalled();
      expect(resultProfiles).toEqual(profiles);
    });
  });
});
