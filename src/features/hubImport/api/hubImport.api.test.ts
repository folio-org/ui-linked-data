import baseApi from '@/common/api/base.api';
import { HUB_IMPORT_API_ENDPOINT } from '@/common/constants/api.constants';

import { buildHubUri, getHubById, getHubByUri, importHub } from './hubImport.api';

jest.mock('@/common/api/base.api');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockBaseApi = baseApi as jest.Mocked<typeof baseApi>;

describe('hubImport.api', () => {
  const mockRecord = {
    id: 'test_id_1',
    resource: { id: 'test_id_1', label: 'Test Hub' },
  } as unknown as RecordEntry;

  beforeEach(() => {
    mockBaseApi.generateUrl.mockReturnValue('/api/hub-import');
  });

  describe('buildHubUri', () => {
    it('Builds hub URI with default source', () => {
      const hubId = 'hub_123';
      const result = buildHubUri(hubId);

      expect(result).toBe('https://id.loc.gov/resources/hubs/hub_123.json');
    });

    it('Builds hub URI with specified source', () => {
      const hubId = 'hub_456';
      const source = 'libraryOfCongress';
      const result = buildHubUri(hubId, source);

      expect(result).toBe('https://id.loc.gov/resources/hubs/hub_456.json');
    });

    it('Throws error for unknown source', () => {
      const hubId = 'hub_789';
      const source = 'unknownSource';

      expect(() => buildHubUri(hubId, source)).toThrow('Unknown hub source: unknownSource');
    });

    it('Builds hub URI with numeric hub id', () => {
      const hubId = '123456';
      const result = buildHubUri(hubId);

      expect(result).toBe('https://id.loc.gov/resources/hubs/123456.json');
    });
  });

  describe('getHubByUri', () => {
    it('Fetches hub by URI with signal', async () => {
      const hubUri = 'https://id.loc.gov/resources/hubs/hub_1.json';
      const signal = new AbortController().signal;
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await getHubByUri({ hubUri, signal });

      expect(mockBaseApi.generateUrl).toHaveBeenCalledWith(HUB_IMPORT_API_ENDPOINT);
      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri,
        },
        requestParams: {
          method: 'GET',
          signal,
        },
      });
      expect(result).toBe(mockRecord);
    });

    it('Fetches hub by URI without signal', async () => {
      const hubUri = 'https://id.loc.gov/resources/hubs/hub_2.json';
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await getHubByUri({ hubUri });

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri,
        },
        requestParams: {
          method: 'GET',
          signal: undefined,
        },
      });
      expect(result).toBe(mockRecord);
    });
  });

  describe('importHub', () => {
    it('Imports hub by URI with POST request', async () => {
      const hubUri = 'https://id.loc.gov/resources/hubs/hub_1.json';
      const signal = new AbortController().signal;
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await importHub({ hubUri, signal });

      expect(mockBaseApi.generateUrl).toHaveBeenCalledWith(HUB_IMPORT_API_ENDPOINT);
      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri,
        },
        requestParams: {
          method: 'POST',
          signal,
        },
      });
      expect(result).toBe(mockRecord);
    });

    it('Imports hub without signal', async () => {
      const hubUri = 'https://id.loc.gov/resources/hubs/hub_2.json';
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await importHub({ hubUri });

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri,
        },
        requestParams: {
          method: 'POST',
          signal: undefined,
        },
      });
      expect(result).toBe(mockRecord);
    });
  });

  describe('getHubById', () => {
    it('Fetches hub by id with default source', async () => {
      const hubId = 'hub_123';
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await getHubById({ hubId });

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri: `https://id.loc.gov/resources/hubs/${hubId}.json`,
        },
        requestParams: {
          method: 'GET',
          signal: undefined,
        },
      });
      expect(result).toBe(mockRecord);
    });

    it('Fetches hub by id with specified source', async () => {
      const hubId = 'hub_456';
      const source = 'libraryOfCongress';
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await getHubById({ hubId, source });

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri: `https://id.loc.gov/resources/hubs/${hubId}.json`,
        },
        requestParams: {
          method: 'GET',
          signal: undefined,
        },
      });
      expect(result).toBe(mockRecord);
    });

    it('Fetches hub by id with signal', async () => {
      const hubId = 'hub_789';
      const signal = new AbortController().signal;
      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await getHubById({ hubId, signal });

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/api/hub-import',
        urlParams: {
          hubUri: `https://id.loc.gov/resources/hubs/${hubId}.json`,
        },
        requestParams: {
          method: 'GET',
          signal,
        },
      });
      expect(result).toBe(mockRecord);
    });
  });
});
