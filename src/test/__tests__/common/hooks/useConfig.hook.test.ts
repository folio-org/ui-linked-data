import { MockServicesProvider } from '@src/test/__mocks__/providers/ServicesProvider.mock';
import { renderHook } from '@testing-library/react';
import { useSetRecoilState } from 'recoil';
import { useConfig } from '@common/hooks/useConfig.hook';
import { fetchProfiles } from '@common/api/profiles.api';
import * as SchemaService from '@common/services/schema';

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

jest.mock('recoil', () => ({
  useRecoilState: jest.fn(),
  useSetRecoilState: jest.fn(),
}));
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
      profiles: [],
      selectedProfile: {},
      preparedFields: {},
      schema: {},
      initialSchemaKey: '',
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
    (useSetRecoilState as jest.Mock)
      .mockReturnValueOnce(setProfiles)
      .mockReturnValueOnce(setSelectedProfile)
      .mockReturnValueOnce(setUserValues)
      .mockReturnValueOnce(setPreparedFields)
      .mockReturnValueOnce(setSchema)
      .mockReturnValueOnce(setInitialSchemaKey)
      .mockReturnValueOnce(setSelectedEntries)
      .mockReturnValueOnce(setPreviewContent)
      .mockReturnValueOnce(setSelectedRecordBlocks);

    (SchemaService.SchemaService as jest.Mock).mockImplementation(() => ({ generate: jest.fn() }));
  });

  test('prepareFields - calls "setPreparedFields" and returns an object with required fields', async () => {
    const testResult = {
      templateId_1: {
        id: 'templateId_1',
        name: 'Template 1',
      },
    };

    const { result } = renderHook(useConfig, { wrapper: MockServicesProvider });
    const preparedFields = result.current.prepareFields(profiles);

    expect(setPreparedFields).toHaveBeenCalledWith(testResult);
    expect(preparedFields).toEqual(testResult);
  });

  test('getProfiles - calls "setProfiles" and returns an array of profiles', async () => {
    const record = {
      resource: {},
    } as RecordEntry;
    (fetchProfiles as jest.Mock).mockImplementation(() => profiles);

    const { result } = renderHook(useConfig, { wrapper: MockServicesProvider });
    const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

    expect(setProfiles).toHaveBeenCalledWith(profiles);
    expect(resultProfiles).toEqual(profiles);
  });
});
