import baseApi from '@/common/api/base.api';
import * as ApiConstants from '@/common/constants/api.constants';
import * as EnvHelper from '@/common/helpers/env.helper';
import { localStorageService } from '@/common/services/storage';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

jest.mock('@/common/services/storage');
jest.mock('@/common/helpers/env.helper', () => ({
  getEnvVariable: jest.fn(),
}));

describe('base.api', () => {
  const mockLocalStorageService = localStorageService as jest.Mocked<typeof localStorageService>;
  const mockGetEnvVariable = EnvHelper.getEnvVariable as jest.MockedFunction<typeof EnvHelper.getEnvVariable>;
  const mockOkapiConfig = getMockedImportedConstant(ApiConstants, 'OKAPI_CONFIG');
  const mockEditorApiBasePath = getMockedImportedConstant(ApiConstants, 'EDITOR_API_BASE_PATH');

  const mockOkapiConfigValue = 'test_okapi_config';
  const mockEditorApiBasePathValue = 'EDITOR_API_BASE_PATH';
  const mockTenant = 'test_tenant';
  const mockBasePath = '/api/base';
  const mockUrl = '/test/endpoint';
  const mockResponse = { data: 'test data' };

  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockOkapiConfig(mockOkapiConfigValue);
    mockEditorApiBasePath(mockEditorApiBasePathValue);

    mockFetch = global.fetch = jest.fn();
    mockGetEnvVariable.mockReturnValue('/default/path');
  });

  describe('getJson', () => {
    let mockResponseObj: Response;

    beforeEach(() => {
      mockResponseObj = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;
    });

    test('returns JSON response for successful request', async () => {
      mockFetch.mockResolvedValue(mockResponseObj as unknown as Response);
      mockLocalStorageService.deserialize.mockReturnValue({
        basePath: mockBasePath,
        tenant: mockTenant,
      });

      const result = await baseApi.getJson({ url: mockUrl });

      expect(result).toEqual(mockResponse);
      expect(mockResponseObj.json).toHaveBeenCalled();
    });

    test('returns response object for unsuccessful request', async () => {
      const mockResponseObj = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'mock error' }),
      };
      mockFetch.mockResolvedValue(mockResponseObj as unknown as Response);
      mockLocalStorageService.deserialize.mockReturnValue({
        basePath: mockBasePath,
        tenant: mockTenant,
      });

      await expect(baseApi.getJson({ url: mockUrl })).rejects.toEqual({ error: 'mock error' });
      expect(mockResponseObj.json).toHaveBeenCalled();
    });

    test('uses default GET method', async () => {
      mockFetch.mockResolvedValue(mockResponseObj as unknown as Response);
      mockLocalStorageService.deserialize.mockReturnValue({
        basePath: mockBasePath,
        tenant: mockTenant,
      });

      await baseApi.getJson({ url: mockUrl });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });

    test('allows custom request parameters', async () => {
      mockFetch.mockResolvedValue(mockResponseObj as unknown as Response);
      mockLocalStorageService.deserialize.mockReturnValue({
        basePath: mockBasePath,
        tenant: mockTenant,
      });
      const customParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };

      await baseApi.getJson({ url: mockUrl, requestParams: customParams });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    test('passes through all parameters to request method', async () => {
      mockFetch.mockResolvedValue(mockResponseObj as unknown as Response);
      mockLocalStorageService.deserialize.mockReturnValue({
        basePath: mockBasePath,
        tenant: mockTenant,
      });
      const urlParams = { param: 'value' };

      await baseApi.getJson({
        url: mockUrl,
        urlParams,
        sameOrigin: false,
      });

      expect(mockFetch).toHaveBeenCalledWith(`${mockUrl}?param=value`, expect.any(Object));
    });
  });
});
