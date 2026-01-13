import baseApi from '@/common/api/base.api';
import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import { hubLocalCheckService } from './hubLocalCheck.service';

jest.mock('@/common/api/base.api');

const mockBaseApi = baseApi as jest.Mocked<typeof baseApi>;

describe('hubLocalCheckService', () => {
  describe('checkLocalAvailability', () => {
    it('returns empty set when tokens array is empty', async () => {
      const result = await hubLocalCheckService.checkLocalAvailability([]);

      expect(result).toEqual(new Set());
      expect(mockBaseApi.getJson).not.toHaveBeenCalled();
    });

    it('returns empty set when tokens is null', async () => {
      const result = await hubLocalCheckService.checkLocalAvailability(null as unknown as string[]);

      expect(result).toEqual(new Set());
      expect(mockBaseApi.getJson).not.toHaveBeenCalled();
    });

    it('checks local availability and returns originalIds set', async () => {
      const tokens = ['token_1', 'token_2', 'token_3'];
      const mockResponse = {
        content: [
          { id: 'id_1', originalId: 'token_1' },
          { id: 'id_2', originalId: 'token_2' },
        ],
      };

      mockBaseApi.getJson.mockResolvedValue(mockResponse);

      const result = await hubLocalCheckService.checkLocalAvailability(tokens);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: expect.stringContaining(SEARCH_API_ENDPOINT.HUBS_LOCAL),
      });
      expect(result).toEqual(new Set(['token_1', 'token_2']));
    });

    it('builds correct query with multiple tokens', async () => {
      const tokens = ['token_1', 'token_2'];
      const mockResponse = { content: [] };

      mockBaseApi.getJson.mockResolvedValue(mockResponse);

      await hubLocalCheckService.checkLocalAvailability(tokens);

      const callArgs = mockBaseApi.getJson.mock.calls[0][0];
      expect(callArgs.url).toContain('query=');
      expect(callArgs.url).toContain('originalId');
    });

    it('handles empty response content', async () => {
      const tokens = ['token_1'];
      const mockResponse = { content: [] };

      mockBaseApi.getJson.mockResolvedValue(mockResponse);

      const result = await hubLocalCheckService.checkLocalAvailability(tokens);

      expect(result).toEqual(new Set());
    });

    it('handles response without content field', async () => {
      const tokens = ['token_1'];
      const mockResponse = {};

      mockBaseApi.getJson.mockResolvedValue(mockResponse);

      const result = await hubLocalCheckService.checkLocalAvailability(tokens);

      expect(result).toEqual(new Set());
    });

    it('filters out entries without originalId', async () => {
      const tokens = ['token_1', 'token_2'];
      const mockResponse = {
        content: [{ id: 'id_1', originalId: 'token_1' }, { id: 'id_2' }, { id: 'id_3', originalId: undefined }],
      };

      mockBaseApi.getJson.mockResolvedValue(mockResponse);

      const result = await hubLocalCheckService.checkLocalAvailability(tokens);

      expect(result).toEqual(new Set(['token_1']));
    });
  });
});
