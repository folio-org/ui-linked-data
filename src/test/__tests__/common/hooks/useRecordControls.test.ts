import { renderHook } from '@testing-library/react';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import * as recordsApi from '@common/api/records.api';
import * as recordHelper from '@common/helpers/record.helper';
import { RecordStatus } from '@common/constants/record.constants';
import { StatusType } from '@common/constants/status.constants';
import { BibframeEntities } from '@common/constants/bibframe.constants';
import { ExternalResourceIdType } from '@common/constants/api.constants';
import { ROUTES } from '@common/constants/routes.constants';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useRecordGeneration } from '@common/hooks/useRecordGeneration';
import { PreviewParams } from '@common/hooks/useConfig.hook';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useInputsStore, useStatusStore } from '@src/store';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: {} }),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

jest.mock('@common/api/records.api', () => ({
  getRecord: jest.fn(),
  postRecord: jest.fn(),
  putRecord: jest.fn(),
}));

const mockDispatchUnblockEvent = jest.fn();
jest.mock('@common/hooks/useContainerEvents', () => ({
  useContainerEvents: () => ({
    dispatchUnblockEvent: mockDispatchUnblockEvent,
    dispatchNavigateToOriginEventWithFallback: jest.fn(),
  }),
}));

const mockGenerateRecord = jest.fn();
jest.mock('@common/hooks/useRecordGeneration', () => ({
  useRecordGeneration: () => ({
    generateRecord: mockGenerateRecord,
  }),
}));

const mockGetProfiles = jest.fn();
jest.mock('@common/hooks/useConfig.hook', () => ({
  useConfig: () => ({
    getProfiles: mockGetProfiles,
  }),
}));

jest.mock('@common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

describe('useRecordControls', () => {
  const mockSetRecordStatus = jest.fn();
  const mockApiResponse = { id: 'test-id' };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockReturnValue();
  });

  describe('saveRecord', () => {
    beforeEach(() => {
      setInitialGlobalState([
        {
          store: useStatusStore,
          state: {
            setRecordStatus: mockSetRecordStatus,
          },
        },
        {
          store: useInputsStore,
          state: {
            selectedRecordBlocks: null,
            record: {},
          },
        },
      ]);

      mockGenerateRecord.mockReturnValue({});
    });

    it('saves record with default props', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.postRecord as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecordControls());
      await result.current.saveRecord();

      expect(recordsApi.postRecord).toHaveBeenCalled();
    });

    it('handles save with asRefToNewRecord=true', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.postRecord as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecordControls());
      await result.current.saveRecord({ asRefToNewRecord: true });

      expect(recordsApi.postRecord).toHaveBeenCalled();
    });

    it('handles save with isNavigatingBack=false', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.putRecord as jest.Mock).mockResolvedValue(mockResponse);

      jest.spyOn(recordHelper, 'getRecordId').mockReturnValue('existing-id');

      const { result } = renderHook(() => useRecordControls());
      await result.current.saveRecord({ isNavigatingBack: false });

      expect(recordsApi.putRecord).toHaveBeenCalled();
    });

    it('handles save errors', async () => {
      (recordsApi.postRecord as jest.Mock).mockRejectedValue(new Error('Save failed'));

      const { result } = renderHook(() => useRecordControls());
      await result.current.saveRecord();

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.cantSaveRd');
    });

    it('updates record status on successful save', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.postRecord as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecordControls());
      await result.current.saveRecord();

      expect(mockSetRecordStatus).toHaveBeenCalledWith({
        type: RecordStatus.saveAndClose,
      });
    });

    it('does not save if generateRecord returns null', async () => {
      jest.spyOn(useRecordGeneration(), 'generateRecord').mockReturnValue(undefined);

      const { result } = renderHook(() => useRecordControls());
      await result.current.saveRecord();

      expect(recordsApi.postRecord).not.toHaveBeenCalled();
      expect(recordsApi.putRecord).not.toHaveBeenCalled();
    });
  });

  describe('fetchRecordAndSelectEntityValues', () => {
    it('navigates to create route when contents are not found', async () => {
      (recordsApi.getRecord as jest.Mock).mockResolvedValue({ resource: {} });

      const { result } = renderHook(() => useRecordControls());
      await result.current.fetchRecordAndSelectEntityValues('test-id', BibframeEntities.WORK);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.RESOURCE_CREATE.uri);
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(
        StatusType.error,
        'ld.cantSelectReferenceContents',
      );
    });

    it('handles errors during fetch', async () => {
      (recordsApi.getRecord as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useRecordControls());
      await result.current.fetchRecordAndSelectEntityValues('test-id', BibframeEntities.WORK);

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorFetching');
    });

    it('returns undefined when the record fetch fails', async () => {
      (recordsApi.getRecord as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useRecordControls());
      const response = await result.current.fetchRecordAndSelectEntityValues('test-id', BibframeEntities.WORK);

      expect(response).toBeUndefined();
    });
  });

  describe('getRecordAndInitializeParsing', () => {
    const mockRecord = { id: 'test-id', data: 'test data' };

    it('returns undefined when no recordId and no cachedRecord provided', async () => {
      const { result } = renderHook(() => useRecordControls());
      const response = await result.current.getRecordAndInitializeParsing({});

      expect(response).toBeUndefined();
      expect(recordsApi.getRecord).not.toHaveBeenCalled();
      expect(mockGetProfiles).not.toHaveBeenCalled();
    });

    it('uses cachedRecord when provided', async () => {
      const cachedRecord = { ...mockRecord } as unknown as RecordEntry;
      mockGetProfiles.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRecordControls());
      const response = await result.current.getRecordAndInitializeParsing({
        cachedRecord,
      });

      expect(response).toEqual(cachedRecord);
      expect(recordsApi.getRecord).not.toHaveBeenCalled();
      expect(mockGetProfiles).toHaveBeenCalledWith({
        record: cachedRecord,
        recordId: undefined,
        previewParams: undefined,
      });
    });

    it('fetches record when recordId is provided', async () => {
      (recordsApi.getRecord as jest.Mock).mockResolvedValue(mockRecord);
      mockGetProfiles.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRecordControls());
      const response = await result.current.getRecordAndInitializeParsing({
        recordId: 'test-id',
      });

      expect(response).toEqual(mockRecord);
      expect(recordsApi.getRecord).toHaveBeenCalledWith({
        recordId: 'test-id',
        idType: undefined,
      });
    });

    it('passes idType to getRecord when provided', async () => {
      (recordsApi.getRecord as jest.Mock).mockResolvedValue(mockRecord);
      mockGetProfiles.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRecordControls());
      await result.current.getRecordAndInitializeParsing({
        recordId: 'test-id',
        idType: ExternalResourceIdType.Inventory,
      });

      expect(recordsApi.getRecord).toHaveBeenCalledWith({
        recordId: 'test-id',
        idType: ExternalResourceIdType.Inventory,
      });
    });

    it('handles error with default error message', async () => {
      (recordsApi.getRecord as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useRecordControls());
      const response = await result.current.getRecordAndInitializeParsing({
        recordId: 'test-id',
      });

      expect(response).toBeUndefined();
      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorFetching');
    });

    it('handles error with custom error message', async () => {
      (recordsApi.getRecord as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useRecordControls());
      await result.current.getRecordAndInitializeParsing({
        recordId: 'test-id',
        errorMessage: 'custom.error',
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'custom.error');
    });

    it('passes preview params to getProfiles', async () => {
      const previewParams = { param: 'value' } as unknown as PreviewParams;
      (recordsApi.getRecord as jest.Mock).mockResolvedValue(mockRecord);
      mockGetProfiles.mockResolvedValue(undefined);

      const { result } = renderHook(() => useRecordControls());
      await result.current.getRecordAndInitializeParsing({
        recordId: 'test-id',
        previewParams,
      });

      expect(mockGetProfiles).toHaveBeenCalledWith({
        record: mockRecord,
        recordId: 'test-id',
        previewParams,
      });
    });
  });

  describe('changeRecordProfile', () => {
    const mockSetRecord = jest.fn();
    const mockSetIsEdited = jest.fn();
    const mockSetLastSavedRecordId = jest.fn();
    const mockSelectedRecordBlocks = { block: 'test-block' };
    const mockRecord = { id: 'record-id', data: 'test data' };
    const mockNewProfileId = '456';
    const mockResponseData = { id: 'updated-record-id', data: 'updated data' };

    beforeEach(() => {
      setInitialGlobalState([
        {
          store: useStatusStore,
          state: {
            setIsRecordEdited: mockSetIsEdited,
            setLastSavedRecordId: mockSetLastSavedRecordId,
          },
        },
        {
          store: useInputsStore,
          state: {
            record: mockRecord,
            setRecord: mockSetRecord,
            selectedRecordBlocks: mockSelectedRecordBlocks,
          },
        },
      ]);

      mockGenerateRecord.mockReturnValue({ generated: 'record' });
      jest
        .spyOn(recordHelper, 'getRecordId')
        .mockReturnValueOnce('record-id')
        .mockReturnValueOnce('record-id')
        .mockReturnValueOnce('updated-record-id')
        .mockReturnValueOnce('updated-record-id');
    });

    it('successfully changes record profile', async () => {
      mockGenerateRecord.mockReturnValue(mockResponseData);

      const { result } = renderHook(() => useRecordControls());
      await result.current.changeRecordProfile({ profileId: mockNewProfileId });

      expect(mockGenerateRecord).toHaveBeenCalledWith({ profileId: mockNewProfileId });
    });

    it('does not proceed if generateRecord returns nothing', async () => {
      mockGenerateRecord.mockReturnValue(undefined);

      const { result } = renderHook(() => useRecordControls());
      await result.current.changeRecordProfile({ profileId: mockNewProfileId });

      expect(recordsApi.putRecord).not.toHaveBeenCalled();
      expect(mockSetRecord).not.toHaveBeenCalled();
    });
  });
});
