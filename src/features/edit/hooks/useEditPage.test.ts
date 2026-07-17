import { setInitialGlobalState } from '@/test/__mocks__/store';

import { act, renderHook } from '@testing-library/react';

import { StatusType } from '@/common/constants/status.constants';
import * as recordHelper from '@/common/helpers/record.helper';
import { UserNotificationFactory } from '@/common/services/userNotification';
import {
  getProfileBfid,
  getReference,
  hasReference,
  mapToResourceType,
  resolveResourceType,
} from '@/configs/resourceTypes';

import { useInputsStore, useLoadingStateStore, useProfileStore, useStatusStore, useUIStore } from '@/store';

import { useEditPage } from './useEditPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams('type=instance'), jest.fn()],
}));

const mockProcessResource = jest.fn();
const mockFetchQuery = jest.fn();
const mockGenerateRecord = jest.fn();
const mockResourceQueryOptions = jest.fn((id: string) => ({ queryKey: ['resource', id] }));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    fetchQuery: mockFetchQuery,
  }),
}));

jest.mock('@/features/resources', () => ({
  generateResourceQueryOptions: (id: string) => mockResourceQueryOptions(id),
  useRecordGeneration: () => ({ generateRecord: mockGenerateRecord }),
  useResourceProcessing: () => ({ processResource: mockProcessResource }),
}));

jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn((type, key) => ({ type, key })),
  },
}));

jest.mock('@/configs/resourceTypes', () => ({
  mapToResourceType: jest.fn(() => 'instance'),
  resolveResourceType: jest.fn(() => 'instance'),
  getProfileBfid: jest.fn(() => 'lde:Profile:Instance'),
  hasReference: jest.fn(() => false),
  getReference: jest.fn(),
}));

const mockSelectedEntriesServiceSet = jest.fn();

jest.mock('@/common/hooks/useSchemaPipeline', () => ({
  useSchemaPipeline: () => ({
    selectedEntriesService: { set: mockSelectedEntriesServiceSet },
  }),
}));

const mockSetIsLoading = jest.fn();
const mockSetSelectedProfile = jest.fn();
const mockSetSelectedProfileSettingsId = jest.fn();
const mockSetInitialSchemaKey = jest.fn();
const mockSetSchema = jest.fn();
const mockSetUserValues = jest.fn();
const mockSetSelectedRecordBlocks = jest.fn();
const mockSetSelectedEntries = jest.fn();
const mockSetRecord = jest.fn();
const mockSetIsEdited = jest.fn();
const mockAddStatusMessagesItem = jest.fn();
const mockSetCurrentlyEditedEntityBfid = jest.fn();
const mockSetCurrentlyPreviewedEntityBfid = jest.fn();

const setupStores = () => {
  setInitialGlobalState([
    {
      store: useLoadingStateStore,
      state: { setIsLoading: mockSetIsLoading },
    },
    {
      store: useProfileStore,
      state: {
        setSelectedProfile: mockSetSelectedProfile,
        setSelectedProfileSettingsId: mockSetSelectedProfileSettingsId,
        setInitialSchemaKey: mockSetInitialSchemaKey,
        setSchema: mockSetSchema,
      },
    },
    {
      store: useInputsStore,
      state: {
        setUserValues: mockSetUserValues,
        setSelectedRecordBlocks: mockSetSelectedRecordBlocks,
        setSelectedEntries: mockSetSelectedEntries,
        setRecord: mockSetRecord,
      },
    },
    {
      store: useStatusStore,
      state: {
        setIsRecordEdited: mockSetIsEdited,
        addStatusMessagesItem: mockAddStatusMessagesItem,
      },
    },
    {
      store: useUIStore,
      state: {
        setCurrentlyEditedEntityBfid: mockSetCurrentlyEditedEntityBfid,
        setCurrentlyPreviewedEntityBfid: mockSetCurrentlyPreviewedEntityBfid,
      },
    },
  ]);
};

const mockProcessedResource = {
  selectedProfile: [{ id: 'p1' }],
  schema: { key: 'schema' },
  initKey: 'init-key',
  userValues: { field: 'value' },
  selectedEntries: ['entry-1'],
  selectedRecordBlocks: { block: 'block-uri' },
};

describe('useEditPage', () => {
  beforeEach(() => {
    (mapToResourceType as jest.Mock).mockReturnValue('instance');
    (getProfileBfid as jest.Mock).mockReturnValue('lde:Profile:Instance');
    (hasReference as jest.Mock).mockReturnValue(false);
    setupStores();
  });

  describe('applyToStores', () => {
    it('calls selectedEntriesService.set with selectedEntries from the processed resource', async () => {
      mockProcessResource.mockResolvedValue(mockProcessedResource);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.initNewResource();
      });

      expect(mockSelectedEntriesServiceSet).toHaveBeenCalledWith(mockProcessedResource.selectedEntries);
    });
  });

  describe('initNewResource', () => {
    it('calls processResource and applies result to stores on success', async () => {
      mockProcessResource.mockResolvedValue(mockProcessedResource);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.initNewResource();
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockProcessResource).toHaveBeenCalledWith({});
      expect(mockSetSchema).toHaveBeenCalledWith(mockProcessedResource.schema);
      expect(mockSetUserValues).toHaveBeenCalledWith(mockProcessedResource.userValues);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('does not apply to stores when processResource returns null', async () => {
      mockProcessResource.mockResolvedValue(null);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.initNewResource();
      });

      expect(mockSetSchema).not.toHaveBeenCalled();
    });

    it('reports error status message when processResource throws', async () => {
      mockProcessResource.mockRejectedValue(new Error('load error'));

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.initNewResource();
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorFetching');
      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('loadResource with resourceId', () => {
    it('fetches record, processes it and applies to stores', async () => {
      const mockRecord = { resource: { uri: 'test' } };
      mockFetchQuery.mockResolvedValue(mockRecord);
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest.spyOn(recordHelper, 'getPrimaryEntitiesFromRecord').mockReturnValue(['lde:Profile:Instance']);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('resource-id-1');
      });

      expect(mockFetchQuery).toHaveBeenCalled();
      expect(mockProcessResource).toHaveBeenCalledWith(expect.objectContaining({ record: mockRecord, asClone: false }));
      expect(mockSetSchema).toHaveBeenCalledWith(mockProcessedResource.schema);
    });

    it('calls setIsEdited(false) when not a clone', async () => {
      mockFetchQuery.mockResolvedValue({ resource: {} });
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest.spyOn(recordHelper, 'getPrimaryEntitiesFromRecord').mockReturnValue([]);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('resource-id-1');
      });

      expect(mockSetIsEdited).toHaveBeenCalledWith(false);
    });

    it('does not call setIsEdited when asClone is true', async () => {
      mockFetchQuery.mockResolvedValue({ resource: {} });
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest.spyOn(recordHelper, 'getPrimaryEntitiesFromRecord').mockReturnValue([]);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('resource-id-1', { asClone: true });
      });

      expect(mockSetIsEdited).not.toHaveBeenCalled();
    });

    it('returns early and does not apply stores when processResource returns null', async () => {
      mockFetchQuery.mockResolvedValue({ resource: {} });
      mockProcessResource.mockResolvedValue(null);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('resource-id-1');
      });

      expect(mockSetSchema).not.toHaveBeenCalled();
    });

    it('reports error status message when fetching fails', async () => {
      mockFetchQuery.mockRejectedValue(new Error('network error'));

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('resource-id-1');
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorLoadingResource');
      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
    });
  });

  describe('loadResource with ref', () => {
    it('fetches via ref and applies entity bfids before processing', async () => {
      // Provide a record that has contents under the Work URI so fetchRefRecord succeeds
      const WORK_URI = 'http://bibfra.me/vocab/lite/Work';
      const mockRecord = {
        resource: {
          [WORK_URI]: { 'http://bibfra.me/vocab/library/mainTitle': ['Test Work Title'] },
        },
      };
      mockFetchQuery.mockResolvedValue(mockRecord);
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest.spyOn(recordHelper, 'getPrimaryEntitiesFromRecord').mockReturnValue([]);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource(null, { ref: 'ref-id-1' });
      });

      expect(mockFetchQuery).toHaveBeenCalled();
      expect(mockSetCurrentlyEditedEntityBfid).toHaveBeenCalledWith(new Set(['lde:Profile:Instance']));
    });

    it('navigates to create route when referenced contents are missing', async () => {
      // Return a record that lacks the Work URI key so contents are missing
      const mockRecord = {
        resource: {
          'http://bibfra.me/vocab/lite/Instance': {},
        },
      };
      mockFetchQuery.mockResolvedValue(mockRecord);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource(null, { ref: 'ref-id-missing' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/resources/create');
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.error,
        'ld.cantSelectReferenceContents',
      );
    });
  });

  describe('applyEntityBfids', () => {
    it('uses entities from record when record is provided', async () => {
      const mockRecord = { resource: {} };
      mockFetchQuery.mockResolvedValue(mockRecord);
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest
        .spyOn(recordHelper, 'getPrimaryEntitiesFromRecord')
        .mockReturnValueOnce(['lde:Profile:Instance'])
        .mockReturnValueOnce(['lde:Profile:Work']);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('resource-id-1');
      });

      expect(mockSetCurrentlyEditedEntityBfid).toHaveBeenCalledWith(new Set(['lde:Profile:Instance']));
      expect(mockSetCurrentlyPreviewedEntityBfid).toHaveBeenCalledWith(new Set(['lde:Profile:Work']));
    });

    it('sets empty previewed set when no record and hasReference is false', async () => {
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      (hasReference as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.initNewResource();
      });

      expect(mockSetCurrentlyPreviewedEntityBfid).toHaveBeenCalledWith(new Set());
    });

    it('sets reference bfid in previewed set when no record and hasReference is true', async () => {
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      (hasReference as jest.Mock).mockReturnValue(true);
      (getReference as jest.Mock).mockReturnValue({ targetType: 'work' });
      (getProfileBfid as jest.Mock).mockReturnValueOnce('lde:Profile:Instance').mockReturnValueOnce('lde:Profile:Work');

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.initNewResource();
      });

      expect(mockSetCurrentlyPreviewedEntityBfid).toHaveBeenCalledWith(new Set(['lde:Profile:Work']));
    });
  });

  describe('isWorkClone behavior', () => {
    const WORK_URI = 'http://bibfra.me/vocab/lite/Work';
    const INSTANCE_REF_KEY = '_instanceReference';

    it('strips the instance reference from the record when cloning a work', async () => {
      (mapToResourceType as jest.Mock).mockReturnValue('work');
      (resolveResourceType as jest.Mock).mockReturnValue('work');

      const mockRecord = {
        resource: {
          [WORK_URI]: {
            someField: ['test value'],
            [INSTANCE_REF_KEY]: [{ id: 'instance-1' }],
          },
        },
      };

      mockFetchQuery.mockResolvedValue(mockRecord);
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest.spyOn(recordHelper, 'getPrimaryEntitiesFromRecord').mockReturnValue([]);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('work-id-1', { asClone: true });
      });

      const storedRecord = mockSetRecord.mock.calls[0][0];
      expect(storedRecord.resource[WORK_URI]).not.toHaveProperty(INSTANCE_REF_KEY);
      expect(storedRecord.resource[WORK_URI]).toHaveProperty('someField');
    });

    it('passes the original record to stores when cloning an instance (preserves work preview)', async () => {
      (mapToResourceType as jest.Mock).mockReturnValue('instance');
      (resolveResourceType as jest.Mock).mockReturnValue('instance');

      const mockRecord = { resource: { uri: 'test-instance' } };

      mockFetchQuery.mockResolvedValue(mockRecord);
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      jest.spyOn(recordHelper, 'getPrimaryEntitiesFromRecord').mockReturnValue([]);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.loadResource('instance-id-1', { asClone: true });
      });

      // original record is passed so the linked work preview remains visible
      expect(mockSetRecord).toHaveBeenCalledWith(mockRecord);
    });
  });

  describe('applyUpdatedSettingsToResource', () => {
    const mockProfileSettingsId = 'settings-id';
    it('calls generateRecord, processResource and applies result to stores on success', async () => {
      mockProcessResource.mockResolvedValue(mockProcessedResource);
      mockGenerateRecord.mockReturnValue(null);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.applyUpdatedSettingsToResource(mockProfileSettingsId);
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockGenerateRecord).toHaveBeenCalledWith({});
      expect(mockProcessResource).toHaveBeenCalledWith({ profileSettingsId: mockProfileSettingsId });
      expect(mockSetSchema).toHaveBeenCalledWith(mockProcessedResource.schema);
      expect(mockSetUserValues).toHaveBeenCalledWith(mockProcessedResource.userValues);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('does not apply to stores when processResource returns null', async () => {
      mockProcessResource.mockResolvedValue(null);

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.applyUpdatedSettingsToResource(mockProfileSettingsId);
      });

      expect(mockSetSchema).not.toHaveBeenCalled();
    });

    it('reports error status message when processResource throws', async () => {
      mockProcessResource.mockRejectedValue(new Error('load error'));

      const { result } = renderHook(() => useEditPage());

      await act(async () => {
        await result.current.applyUpdatedSettingsToResource(mockProfileSettingsId);
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.error,
        'ld.errorApplyingProfileSettings',
      );
      expect(mockAddStatusMessagesItem).toHaveBeenCalled();
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });
});
