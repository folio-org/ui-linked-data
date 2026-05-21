import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { RecordStatus } from '@/common/constants/record.constants';
import { StatusType } from '@/common/constants/status.constants';
import * as recordHelper from '@/common/helpers/record.helper';
import { UserNotificationFactory } from '@/common/services/userNotification';

import * as recordsApi from '@/features/resources';

import { useInputsStore, useStatusStore } from '@/store';

import { useRecordMutations } from './useRecordMutations';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: {} }),
  useSearchParams: () => [new URLSearchParams('type=hub'), jest.fn()],
}));

const mockGenerateRecord = jest.fn();
jest.mock('@/features/resources', () => ({
  getRecord: jest.fn(),
  postRecord: jest.fn(),
  putRecord: jest.fn(),
  deleteRecord: jest.fn(),
  useRecordGeneration: () => ({
    generateRecord: mockGenerateRecord,
  }),
}));

const mockDiscardRecord = jest.fn();
jest.mock('@/features/resources/hooks/useRecordNavigation', () => ({
  useRecordNavigation: () => ({ discardRecord: mockDiscardRecord }),
}));

jest.mock('@/common/hooks/useContainerEvents', () => ({
  useContainerEvents: () => ({
    dispatchUnblockEvent: jest.fn(),
    dispatchNavigateToOriginEventWithFallback: jest.fn(),
  }),
}));

const mockGetProfiles = jest.fn();
jest.mock('@/common/hooks/useConfig.hook', () => ({
  useConfig: () => ({
    getProfiles: mockGetProfiles,
  }),
}));

jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

describe('useRecordMutations', () => {
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

      const { result } = renderHook(() => useRecordMutations());
      await result.current.saveRecord();

      expect(recordsApi.postRecord).toHaveBeenCalled();
    });

    it('handles save with asRefToNewRecord=true', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.postRecord as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecordMutations());
      await result.current.saveRecord({ asRefToNewRecord: true });

      expect(recordsApi.postRecord).toHaveBeenCalled();
    });

    it('handles save with isNavigatingBack=false', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.putRecord as jest.Mock).mockResolvedValue(mockResponse);

      jest.spyOn(recordHelper, 'getRecordId').mockReturnValue('existing-id');

      const { result } = renderHook(() => useRecordMutations());
      await result.current.saveRecord({ isNavigatingBack: false });

      expect(recordsApi.putRecord).toHaveBeenCalled();
    });

    it('handles save errors', async () => {
      (recordsApi.postRecord as jest.Mock).mockRejectedValue(new Error('Save failed'));

      const { result } = renderHook(() => useRecordMutations());
      await result.current.saveRecord();

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.cantSaveRd');
    });

    it('updates record status on successful save', async () => {
      const mockResponse = { json: () => Promise.resolve(mockApiResponse) };
      (recordsApi.postRecord as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecordMutations());
      await result.current.saveRecord();

      expect(mockSetRecordStatus).toHaveBeenCalledWith({
        type: RecordStatus.saveAndClose,
      });
    });

    it('does not save if generateRecord returns null', async () => {
      mockGenerateRecord.mockReturnValue(undefined);

      const { result } = renderHook(() => useRecordMutations());
      await result.current.saveRecord();

      expect(recordsApi.postRecord).not.toHaveBeenCalled();
      expect(recordsApi.putRecord).not.toHaveBeenCalled();
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

      const { result } = renderHook(() => useRecordMutations());
      await result.current.changeRecordProfile({ profileId: mockNewProfileId });

      expect(mockGenerateRecord).toHaveBeenCalledWith({ profileId: mockNewProfileId });
    });

    it('does not proceed if generateRecord returns nothing', async () => {
      mockGenerateRecord.mockReturnValue(undefined);

      const { result } = renderHook(() => useRecordMutations());
      await result.current.changeRecordProfile({ profileId: mockNewProfileId });

      expect(recordsApi.putRecord).not.toHaveBeenCalled();
      expect(mockSetRecord).not.toHaveBeenCalled();
    });
  });
});
