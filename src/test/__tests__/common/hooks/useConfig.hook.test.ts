import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';
import { renderHook, act } from '@testing-library/react';
import { useConfig } from '@common/hooks/useConfig.hook';
import { fetchProfile, fetchProfiles } from '@common/api/profiles.api';
import * as SchemaService from '@common/services/schema';
import * as FeatureConstants from '@common/constants/feature.constants';
import { useInputsStore, useProfileStore } from '@src/store';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

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

jest.mock('@common/services/schema');
jest.mock('@common/hooks/useLookupCache.hook', () => ({
  useLookupCacheService: () => lookupCacheService,
}));
jest.mock('@common/hooks/useCommonStatus', () => ({
  useCommonStatus: () => commonStatusService,
}));
jest.mock('@common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
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
jest.mock('@common/hooks/useProcessedRecordAndSchema.hook', () => ({
  useProcessedRecordAndSchema: () => ({
    getProcessedRecordAndSchema: () => ({
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
        updatedState: { profiles, preparedFields: null },
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

    (SchemaService.SchemaService as jest.Mock).mockImplementation(() => ({ generate: jest.fn() }));
  });

  test('prepareFields - calls "setPreparedFields" and returns an object with required fields', async () => {
    mockUseGlobalState();
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
    const mockCustomProfileConstant = getMockedImportedConstant(FeatureConstants, 'CUSTOM_PROFILE_ENABLED');

    afterEach(() => {
      mockCustomProfileConstant(false);
    });

    test('calls "fetchProfiles" and "setProfiles" and returns an array of profiles when CUSTOM_PROFILE_ENABLED is false', async () => {
      mockUseGlobalState();
      mockCustomProfileConstant(false);
      (fetchProfiles as jest.Mock).mockImplementation(() => profiles);

      const { result } = renderHook(useConfig);
      const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfiles).toHaveBeenCalled();
      expect(setProfiles).toHaveBeenCalledWith(profiles);
      expect(resultProfiles).toEqual(profiles);
    });

    test('does not call "fetchProfiles" and "setProfiles" and returns a stored array of profiles when CUSTOM_PROFILE_ENABLED is false', async () => {
      mockUseGlobalState(profiles);
      mockCustomProfileConstant(false);

      const { result } = renderHook(useConfig);
      const resultProfiles = await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setProfiles).not.toHaveBeenCalled();
      expect(resultProfiles).toEqual(profiles);
    });

    test('does not call fetchProfiles when CUSTOM_PROFILE_ENABLED is true', async () => {
      (fetchProfile as jest.Mock).mockResolvedValue({ id: 'test-id', name: 'Test Profile' });
      mockUseGlobalState();
      mockCustomProfileConstant(true);

      const { result } = renderHook(useConfig);

      await act(async () => {
        await result.current.getProfiles({ record, recordId: '' });
      });

      expect(fetchProfiles).not.toHaveBeenCalled();
      expect(setProfiles).not.toHaveBeenCalled();
    });
  });
});
