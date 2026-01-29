import { act, renderHook } from '@testing-library/react';

import BaseApi from '@/common/api/base.api';
import { StatusType } from '@/common/constants/status.constants';
import { useApi } from '@/common/hooks/useApi';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useLoadingState, useStatusState } from '@/store';

jest.mock('@/common/api/base.api');
jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));

describe('useApi', () => {
  const mockSetIsLoading = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();
  const mockResponse = { data: 'test data' };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useLoadingState,
        state: { setIsLoading: mockSetIsLoading },
      },
      {
        store: useStatusState,
        state: { addStatusMessagesItem: mockAddStatusMessagesItem },
      },
    ]);

    (BaseApi.getJson as jest.Mock).mockResolvedValue(mockResponse);
    (BaseApi.generateUrl as jest.Mock).mockImplementation(url => url);
  });

  it('initializes with null data', () => {
    const { result } = renderHook(() => useApi());

    expect(result.current.data).toBeNull();
  });

  describe('makeRequest', () => {
    it('handles successful GET request', async () => {
      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.makeRequest({ url: '/test-url' });
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(BaseApi.getJson).toHaveBeenCalledWith({
        url: '/test-url',
        urlParams: undefined,
        requestParams: {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
        },
      });
      expect(result.current.data).toEqual(mockResponse);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('handles POST request with body', async () => {
      const { result } = renderHook(() => useApi());
      const testBody = { key: 'value' };

      await act(async () => {
        await result.current.makeRequest({
          url: '/test-url',
          method: 'POST',
          body: testBody,
        });
      });

      expect(BaseApi.getJson).toHaveBeenCalledWith({
        url: '/test-url',
        urlParams: undefined,
        requestParams: {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(testBody, null, 2),
        },
      });
    });

    it('handles URL parameters correctly', async () => {
      const { result } = renderHook(() => useApi());
      const urlParam = { name: 'id', value: '123' };

      await act(async () => {
        await result.current.makeRequest({
          url: '/test-url',
          urlParam,
        });
      });

      expect(BaseApi.generateUrl).toHaveBeenCalledWith('/test-url', urlParam);
    });

    it('handles errors and shows notification', async () => {
      const error = new Error('API Error');
      (BaseApi.getJson as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.makeRequest({ url: '/test-url' });
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'ld.errorMakingApiRequest');
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('uses custom error message when provided', async () => {
      const error = new Error('API Error');
      (BaseApi.getJson as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useApi());

      await act(async () => {
        await result.current.makeRequest({
          url: '/test-url',
          errorMessageId: 'custom.error',
        });
      });

      expect(UserNotificationFactory.createMessage).toHaveBeenCalledWith(StatusType.error, 'custom.error');
    });

    it('handles request params', async () => {
      const { result } = renderHook(() => useApi());
      const customRequestParams = { credentials: 'include' as RequestCredentials };

      await act(async () => {
        await result.current.makeRequest({
          url: '/test-url',
          requestParams: customRequestParams,
        });
      });

      expect(BaseApi.getJson).toHaveBeenCalledWith({
        url: '/test-url',
        urlParams: undefined,
        requestParams: {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
          ...customRequestParams,
        },
      });
    });
  });
});
