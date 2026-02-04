import baseApi from '@/common/api/base.api';
import { getSearchData } from '@/common/api/search.api';

jest.mock('@/common/api/base.api');
jest.mock('@/features/search/core/strategies/responseTransformers');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockBaseApi = baseApi as jest.Mocked<typeof baseApi>;
const mockTransformer = jest.fn();
const mockHubTransformer = jest.fn();

describe('search.api', () => {
  const mockApiResponse = {
    content: [{ id: '1', title: 'Test' }],
    totalRecords: 1,
  };

  beforeEach(() => {
    mockBaseApi.getJson.mockResolvedValue(mockApiResponse);
    mockTransformer.mockReturnValue({
      content: mockApiResponse.content,
      totalRecords: mockApiResponse.totalRecords,
    });
    mockHubTransformer.mockReturnValue({
      content: mockApiResponse.content,
      totalRecords: mockApiResponse.totalRecords,
    });
  });

  describe('getSearchData', () => {
    it('calls getJson with correct parameters', async () => {
      const url = '/test/endpoint';
      const urlParams = {
        query: 'test query',
        limit: '10',
      };

      await getSearchData(url, urlParams);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/test/endpoint',
        urlParams: {
          query: 'test query',
          limit: '10',
        },
      });
    });

    it('handles undefined url', async () => {
      const result = await getSearchData(undefined, {});
      expect(result).toBeUndefined();
      expect(mockBaseApi.getJson).not.toHaveBeenCalled();
    });

    it('handles complex URL parameters', async () => {
      const url = '/complex/endpoint';
      const urlParams = {
        query: 'complex query',
        limit: '20',
        offset: '10',
        searchBy: 'title',
        searchFilter: 'books',
      };

      await getSearchData(url, urlParams);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/complex/endpoint',
        urlParams: {
          query: 'complex query',
          limit: '20',
          offset: '10',
          searchBy: 'title',
          searchFilter: 'books',
        },
      });
    });
  });
});
