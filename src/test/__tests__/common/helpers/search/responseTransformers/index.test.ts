import { transformSearchResponse, RESPONSE_TRANSFORMERS } from '@common/helpers/search/responseTransformers';

describe('Response Transformers', () => {
  describe('transformSearchResponse', () => {
    test('should transform Hub API response correctly', () => {
      const hubResponse = {
        q: "test*",
        count: 929,
        pagesize: 10,
        start: 0,
        sortmethod: "rank",
        searchtype: "keyword",
        directory: "/resources/hubs/",
        hits: [{ id: 1, title: 'Test Hub' }, { id: 2, title: 'Another Hub' }]
      };
      
      const result = transformSearchResponse({
        result: hubResponse,
        limit: 10,
        apiType: 'hub'
      });
      
      expect(result).toEqual({
        content: [{ id: 1, title: 'Test Hub' }, { id: 2, title: 'Another Hub' }],
        totalRecords: 929,
        totalPages: 93, // Math.ceil(929/10)
        prev: undefined,
        next: undefined
      });
    });

    test('should transform standard FOLIO API response correctly', () => {
      const standardResponse = {
        content: [{ id: 1, title: 'Test Record' }],
        totalRecords: 50,
        totalPages: 5,
        prev: 'prevLink',
        next: 'nextLink'
      };
      
      const result = transformSearchResponse({
        result: standardResponse,
        limit: 10,
        apiType: 'standard'
      });
      
      expect(result).toEqual({
        content: [{ id: 1, title: 'Test Record' }],
        totalRecords: 50,
        totalPages: 5,
        prev: 'prevLink',
        next: 'nextLink'
      });
    });

    test('should handle empty Hub response', () => {
      const hubResponse = {
        q: "nonexistent",
        count: 0,
        pagesize: 10,
        start: 0,
        hits: []
      };
      
      const result = transformSearchResponse({
        result: hubResponse,
        limit: 10,
        apiType: 'hub'
      });
      
      expect(result).toEqual({
        content: [],
        totalRecords: 0,
        totalPages: 0,
        prev: undefined,
        next: undefined
      });
    });

    test('should use resultsContainer for standard responses', () => {
      const standardResponse = {
        authorities: [{ id: 1, title: 'Authority Record' }],
        totalRecords: 25,
        totalPages: 3
      };
      
      const result = transformSearchResponse({
        result: standardResponse,
        resultsContainer: 'authorities',
        limit: 10,
        apiType: 'standard'
      });
      
      expect(result).toEqual({
        content: [{ id: 1, title: 'Authority Record' }],
        totalRecords: 25,
        totalPages: 3,
        prev: undefined,
        next: undefined
      });
    });
  });

  describe('RESPONSE_TRANSFORMERS', () => {
    test('should have hub and standard transformers', () => {
      expect(RESPONSE_TRANSFORMERS.hub).toBeDefined();
      expect(RESPONSE_TRANSFORMERS.standard).toBeDefined();
      expect(typeof RESPONSE_TRANSFORMERS.hub).toBe('function');
      expect(typeof RESPONSE_TRANSFORMERS.standard).toBe('function');
    });
  });
});