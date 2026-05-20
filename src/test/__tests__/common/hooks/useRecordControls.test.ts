import { renderHook } from '@testing-library/react';

import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { BibframeEntities } from '@/common/constants/bibframe.constants';
import { ROUTES } from '@/common/constants/routes.constants';
import { StatusType } from '@/common/constants/status.constants';
import { PreviewParams } from '@/common/hooks/useConfig.hook';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { UserNotificationFactory } from '@/common/services/userNotification';

import * as recordsApi from '@/features/resources';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: {} }),
  useSearchParams: () => [new URLSearchParams('type=hub'), jest.fn()],
}));

jest.mock('@/features/resources', () => ({
  getRecord: jest.fn(),
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

describe('useRecordControls', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockReturnValue();
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
});
