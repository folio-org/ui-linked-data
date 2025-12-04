import { StandardResponseTransformer } from './StandardResponseTransformer';

describe('StandardResponseTransformer', () => {
  const mockLimit = 10;

  describe('without resultsContainer', () => {
    const transformer = new StandardResponseTransformer();

    it('transforms response with content array', () => {
      const response = {
        content: [{ id: '1' }, { id: '2' }],
        totalRecords: 25,
        totalPages: 3,
        prev: 'prev-link',
        next: 'next-link',
      };

      const result = transformer.transform(response, mockLimit);

      expect(result.content).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.totalRecords).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.prev).toBe('prev-link');
      expect(result.next).toBe('next-link');
    });

    it('calculates totalPages when not provided', () => {
      const response = {
        content: [{ id: '1' }],
        totalRecords: 25,
      };

      const result = transformer.transform(response, mockLimit);

      expect(result.totalPages).toBe(3);
    });

    it('handles empty response', () => {
      const result = transformer.transform({}, mockLimit);

      expect(result.content).toEqual([]);
      expect(result.totalRecords).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('with resultsContainer', () => {
    const transformer = new StandardResponseTransformer('authorities');

    it('extracts content from container key', () => {
      const response = {
        authorities: [{ id: '1', type: 'Person' }],
        totalRecords: 10,
      };

      const result = transformer.transform(response, mockLimit);

      expect(result.content).toEqual([{ id: '1', type: 'Person' }]);
    });

    it('prefers content over container when both exist', () => {
      const response = {
        content: [{ id: '1', source: 'content' }],
        authorities: [{ id: '2', source: 'container' }],
        totalRecords: 5,
      };

      const result = transformer.transform(response, mockLimit);

      expect(result.content).toEqual([{ id: '1', source: 'content' }]);
    });

    it('returns empty array when container key not present', () => {
      const response = {
        totalRecords: 0,
      };

      const result = transformer.transform(response, mockLimit);

      expect(result.content).toEqual([]);
    });
  });
});
