import { getByIdentifier, getSearchData, getSearchResults } from '@/common/api/search.api';
import baseApi from '@/common/api/base.api';
import { RESPONSE_TRANSFORMERS } from '@/features/search/core';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';

jest.mock('@/common/api/base.api');
jest.mock('@/features/search/utils/responseTransformers');

const mockBaseApi = baseApi as jest.Mocked<typeof baseApi>;
const mockResponseTransformers = RESPONSE_TRANSFORMERS as jest.Mocked<typeof RESPONSE_TRANSFORMERS>;
const mockTransformer = jest.fn();
const mockHubTransformer = jest.fn();

describe('search.api', () => {
  const mockApiResponse = {
    content: [{ id: '1', title: 'Test' }],
    totalRecords: 1,
  };

  beforeEach(() => {
    mockBaseApi.getJson.mockResolvedValue(mockApiResponse);
    mockResponseTransformers.standard = mockTransformer;
    mockResponseTransformers.hub = mockHubTransformer;
    mockTransformer.mockReturnValue({
      content: mockApiResponse.content,
      totalRecords: mockApiResponse.totalRecords,
    });
    mockHubTransformer.mockReturnValue({
      content: mockApiResponse.content,
      totalRecords: mockApiResponse.totalRecords,
    });
  });

  describe('getByIdentifier', () => {
    it('fetches record by identifier successfully', async () => {
      const mockParams = {
        endpointUrl: '/linked-data/works/test-id',
        query: 'test query',
      };
      const mockRecord = { id: 'test-id', title: 'Test Record' };

      mockBaseApi.getJson.mockResolvedValue(mockRecord);

      const result = await getByIdentifier(mockParams);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/linked-data/works/test-id',
        urlParams: expect.objectContaining({
          query: expect.stringContaining('test query'),
          offset: '0',
          limit: SEARCH_RESULTS_LIMIT.toString(),
        }),
      });
      expect(result).toEqual(mockRecord);
    });

    it('handles API errors', async () => {
      const mockParams = {
        endpointUrl: '/linked-data/works/error-id',
        query: 'error query',
      };
      const mockError = new Error('API Error');

      mockBaseApi.getJson.mockRejectedValue(mockError);

      await expect(getByIdentifier(mockParams)).rejects.toThrow('API Error');
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

  describe('getSearchResults', () => {
    beforeEach(() => {
      mockTransformer.mockReturnValue({
        content: mockApiResponse.content,
        totalRecords: mockApiResponse.totalRecords,
      });
    });

    it('handles traditional string query', async () => {
      const params = {
        endpointUrl: '/test/search',
        query: 'test query',
        limit: 10,
        offset: 10,
        precedingRecordsCount: 5,
      };

      await getSearchResults(params);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/test/search',
        urlParams: {
          query: 'test query',
          limit: '10',
          offset: '10',
          precedingRecordsCount: '5',
        },
        sameOrigin: true,
      });
      expect(mockTransformer).toHaveBeenCalledWith({
        result: mockApiResponse,
        resultsContainer: undefined,
        limit: 10,
      });
    });

    it('uses default limit when not provided', async () => {
      const params = {
        endpointUrl: '/test/search',
        query: 'test query',
      };

      await getSearchResults(params);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/test/search',
        urlParams: {
          query: 'test query',
          limit: SEARCH_RESULTS_LIMIT.toString(), // It's converted to string
        },
        sameOrigin: true,
      });
      expect(mockTransformer).toHaveBeenCalledWith({
        result: mockApiResponse,
        resultsContainer: undefined,
        limit: +SEARCH_RESULTS_LIMIT,
      });
    });

    it('handles custom response type', async () => {
      const params = {
        endpointUrl: '/hub/search',
        query: 'test query',
        responseType: 'hub',
      };

      await getSearchResults(params);

      expect(mockHubTransformer).toHaveBeenCalledWith({
        result: mockApiResponse,
        resultsContainer: undefined,
        limit: +SEARCH_RESULTS_LIMIT,
      });
    });

    it('handles resultsContainer parameter', async () => {
      const params = {
        endpointUrl: '/test/search',
        query: 'test query',
        resultsContainer: 'searchResults',
      };

      await getSearchResults(params);

      expect(mockTransformer).toHaveBeenCalledWith({
        result: mockApiResponse,
        resultsContainer: 'searchResults',
        limit: +SEARCH_RESULTS_LIMIT,
      });
    });

    it('handles sameOrigin parameter', async () => {
      const params = {
        endpointUrl: '/external/search',
        query: 'test query',
        sameOrigin: 'true',
      };

      await getSearchResults(params);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/external/search',
        urlParams: {
          query: 'test query',
          limit: SEARCH_RESULTS_LIMIT.toString(),
        },
        sameOrigin: true,
      });
    });

    it('handles number limit conversion', async () => {
      const params = {
        endpointUrl: '/test/search',
        query: 'test query',
        limit: 10,
      };

      await getSearchResults(params);

      expect(mockBaseApi.getJson).toHaveBeenCalledWith({
        url: '/test/search',
        urlParams: {
          query: 'test query',
          limit: '10',
        },
        sameOrigin: true,
      });
      expect(mockTransformer).toHaveBeenCalledWith({
        result: mockApiResponse,
        resultsContainer: undefined,
        limit: 10,
      });
    });
  });
});
