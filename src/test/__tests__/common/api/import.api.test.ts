import baseApi from '@/common/api/base.api';
import { importFile, importUrl } from '@/common/api/import.api';
import { IMPORT_JSON_FILE_API_ENDPOINT, IMPORT_JSON_URL_API_ENDPOINT } from '@/common/constants/api.constants';

jest.mock('@/common/api/base.api');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockBaseApi = baseApi as jest.Mocked<typeof baseApi>;

describe('import.api', () => {
  const mockImportResponse = {};

  describe('importFile', () => {
    beforeEach(() => {
      mockBaseApi.generateUrl.mockReturnValue('/api/import/file');
    });

    it('uploads file with a POST request', async () => {
      const files = [new File(['{}'], 'test', { type: 'application/json ' })];
      const filterType = 'http://contrived/filter';
      const data = new FormData();
      data.append('fileName', files[0]);
      mockBaseApi.getJson.mockResolvedValue(mockImportResponse);

      // pass the array in
      const result = await importFile(files, filterType);

      expect(mockBaseApi.generateUrl).toHaveBeenCalledWith(IMPORT_JSON_FILE_API_ENDPOINT);
      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/import/file',
        urlParams: {
          filterType,
        },
        requestParams: {
          method: 'POST',
          body: data,
        },
      });
      expect(result).toBe(mockImportResponse);
    });

    it('uploads only the first file', async () => {
      const files = [
        new File(['{}'], 'test1', { type: 'application/json ' }),
        new File(['{}'], 'test2', { type: 'application/json ' }),
      ];
      const filterType = 'http://contrived/filter';
      const data = new FormData();
      data.append('fileName', files[0]);
      mockBaseApi.getJson.mockResolvedValue(mockImportResponse);

      // pass the array in
      const result = await importFile(files, filterType);

      expect(mockBaseApi.generateUrl).toHaveBeenCalledWith(IMPORT_JSON_FILE_API_ENDPOINT);
      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/import/file',
        urlParams: {
          filterType,
        },
        requestParams: {
          method: 'POST',
          body: data,
        },
      });
      expect(result).toBe(mockImportResponse);
    });
  });

  describe('importUrl', () => {
    beforeEach(() => {
      mockBaseApi.generateUrl.mockReturnValue('/api/import/url');
    });

    it('sends a URL to fetch with a POST request', async () => {
      const fetchUrl = 'https://contrived/resources/instances/sample-instance.json';
      const filterType = 'http://contrived/filter';
      const defaultWorkType = 'http://contrived/work-type';
      mockBaseApi.getJson.mockResolvedValue(mockImportResponse);

      const result = await importUrl(fetchUrl, filterType, defaultWorkType);

      expect(mockBaseApi.generateUrl).toHaveBeenCalledWith(IMPORT_JSON_URL_API_ENDPOINT);
      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/import/url',
        urlParams: {
          url: fetchUrl,
          filterType,
          defaultWorkType,
        },
        requestParams: {
          method: 'POST',
        },
      });
      expect(result).toBe(mockImportResponse);
    });
  });
});
