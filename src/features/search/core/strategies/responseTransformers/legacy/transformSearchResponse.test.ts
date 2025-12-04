import { transformSearchResponse } from './transformSearchResponse';

describe('transformSearchResponse', () => {
  // Mock data constants
  const mockLimit = 10;
  const mockHits = [
    { id: '1', title: 'Hub Result 1' },
    { id: '2', title: 'Hub Result 2' },
  ];
  const mockContent = [
    { id: '1', title: 'Standard Result 1' },
    { id: '2', title: 'Standard Result 2' },
  ];

  describe('Hub API response transformation', () => {
    test('transforms hub response with hits and count', () => {
      const mockHubResult = {
        hits: mockHits,
        count: 25,
      };

      const result = transformSearchResponse({
        result: mockHubResult,
        limit: mockLimit,
        apiType: 'hub',
      });

      expect(result).toEqual({
        content: mockHits,
        totalRecords: 25,
        totalPages: 3,
        prev: undefined,
        next: undefined,
      });
    });

    test('handles empty hub response', () => {
      const result = transformSearchResponse({
        result: {},
        limit: mockLimit,
        apiType: 'hub',
      });

      expect(result).toEqual({
        content: [],
        totalRecords: 0,
        totalPages: 0,
        prev: undefined,
        next: undefined,
      });
    });
  });

  describe('Standard FOLIO API response transformation', () => {
    test('transforms standard response with all fields', () => {
      const mockStandardResult = {
        content: mockContent,
        totalRecords: 20,
        totalPages: 2,
        prev: 'prev-link',
        next: 'next-link',
      };

      const result = transformSearchResponse({
        result: mockStandardResult,
        limit: mockLimit,
      });

      expect(result).toEqual({
        content: mockContent,
        totalRecords: 20,
        totalPages: 2,
        prev: 'prev-link',
        next: 'next-link',
      });
    });

    test('uses resultsContainer when content is missing', () => {
      const mockAuthorityResults = [{ id: '1', authRefType: 'Person' }];
      const mockStandardResult = {
        authorities: mockAuthorityResults,
        totalRecords: 5,
      };

      const result = transformSearchResponse({
        result: mockStandardResult,
        resultsContainer: 'authorities',
        limit: mockLimit,
      });

      expect(result.content).toEqual(mockAuthorityResults);
      expect(result.totalRecords).toBe(5);
      expect(result.totalPages).toBe(1);
    });

    test('handles empty standard response', () => {
      const result = transformSearchResponse({
        result: {},
        limit: mockLimit,
      });

      expect(result).toEqual({
        content: [],
        totalRecords: 0,
        totalPages: 0,
        prev: undefined,
        next: undefined,
      });
    });
  });

  describe('Edge cases', () => {
    test('calculates totalPages when missing', () => {
      const mockStandardResult = {
        content: mockContent,
        totalRecords: 25,
      };

      const result = transformSearchResponse({
        result: mockStandardResult,
        limit: mockLimit,
      });

      expect(result.totalPages).toBe(3);
    });

    test('handles zero limit', () => {
      const mockHubResult = {
        hits: mockHits,
        count: 10,
      };

      const result = transformSearchResponse({
        result: mockHubResult,
        limit: 0,
        apiType: 'hub',
      });

      expect(result.totalPages).toBe(Infinity);
    });
  });
});
