import '@src/test/__mocks__/common/hooks/useServicesContext.mock';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const createDelayedProfileMock = (mockProfile: Profile, delay: number) => {
  const delayedResolve = (resolve: (value: Profile) => void) => {
    setTimeout(() => resolve(mockProfile), delay);
  };

  return () => new Promise(delayedResolve);
};

const setupMockParams = (setSearchParams: jest.Mock, profileId?: string) => {
  const mockQueryParams = new URLSearchParams();

  if (profileId) {
    mockQueryParams.set('profileId', profileId);
  }

  (useSearchParams as jest.Mock).mockReturnValue([mockQueryParams, setSearchParams]);
};

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
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

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

  afterEach(() => {
    queryClient?.clear();
  });

  describe('getProfiles', () => {
    const record = {
      resource: {},
    } as RecordEntry;

    test('calls fetchProfile and sets profile', async () => {
      const mockProfile = [{ id: 'Monograph' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
      setupMockParams(setSearchParams);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['1'],
      });

      const { result } = renderHook(useConfig, { wrapper: createWrapper() });
      await result.current.getProfiles({ record, recordId: '' });

      expect(fetchProfile).toHaveBeenCalled();
      expect(setSelectedProfile).toHaveBeenCalledWith([{ id: 'root' }, ...mockProfile]);
    });

    test('loads single profile when no rootEntry is provided', async () => {
      const mockProfileResult = [{ id: 'SingleProfile' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfileResult);
      setupMockParams(setSearchParams);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ids: ['1'],
      });

      const { result } = renderHook(useConfig, { wrapper: createWrapper() });
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
      setupMockParams(setSearchParams);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['1', '2'],
        rootEntry,
      });

      (fetchProfile as jest.Mock).mockResolvedValueOnce(mockProfileResult1).mockResolvedValueOnce(mockProfileResult2);

      const { result } = renderHook(useConfig, { wrapper: createWrapper() });
      await result.current.getProfiles({
        record,
        recordId: '',
      });

      expect(setSelectedProfile).toHaveBeenCalledWith([rootEntry, mockProfileResult1, mockProfileResult2]);
    });

    test('waits for existing processing when concurrent calls are made with record', async () => {
      const mockProfile = [{ id: 'Profile_1' }] as Profile;
      (fetchProfile as jest.Mock).mockImplementation(createDelayedProfileMock(mockProfile, 100));
      setupMockParams(setSearchParams);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['1'],
      });

      const { result } = renderHook(useConfig, { wrapper: createWrapper() });

      const firstCall = result.current.getProfiles({ record, recordId: 'id_1' });
      const secondCall = result.current.getProfiles({ record, recordId: 'id_2' });

      await Promise.all([firstCall, secondCall]);

      expect(fetchProfile).toHaveBeenCalledTimes(1);
    });

    test('waits for existing processing when concurrent calls are made with recordId', async () => {
      const mockProfile = [{ id: 'Profile_2' }] as Profile;
      (fetchProfile as jest.Mock).mockImplementation(createDelayedProfileMock(mockProfile, 50));
      setupMockParams(setSearchParams);
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['2'],
      });

      const { result } = renderHook(useConfig, { wrapper: createWrapper() });

      const firstCall = result.current.getProfiles({ recordId: 'id_3' });
      const secondCall = result.current.getProfiles({ recordId: 'id_4' });

      await Promise.all([firstCall, secondCall]);

      expect(fetchProfile).toHaveBeenCalledTimes(1);
    });

    test('extracts profile parameters from recordData when present', async () => {
      const mockProfile = [{ id: 'Profile_3' }] as Profile;
      (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
      setupMockParams(setSearchParams, 'profile_1');
      (getProfileConfig as jest.Mock).mockReturnValue({
        ...mockProfileConfig,
        ids: ['3'],
      });

      const recordWithData = {
        resource: {
          WORK: {
            profileId: 'work_profile_1',
            INSTANCE: [
              {
                profileId: 'instance_profile_1',
              },
            ],
          },
        },
      } as unknown as RecordEntry;

      const { result } = renderHook(useConfig, { wrapper: createWrapper() });
      await result.current.getProfiles({ record: recordWithData, recordId: 'id_5' });

      expect(getProfileConfig).toHaveBeenCalled();
      expect(fetchProfile).toHaveBeenCalled();
    });
  });
});
