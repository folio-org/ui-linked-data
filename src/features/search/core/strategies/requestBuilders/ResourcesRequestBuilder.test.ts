import { ResourcesRequestBuilder } from './ResourcesRequestBuilder';

describe('ResourcesRequestBuilder', () => {
  const builder = new ResourcesRequestBuilder();

  describe('build', () => {
    it('builds request with simple search (searchBy provided)', () => {
      const result = builder.build({
        query: 'Moby Dick',
        searchBy: 'title',
        limit: 100,
        offset: 0,
      });

      expect(result.url).toBe('/search/linked-data/works');
      expect(result.urlParams.query).toBe('(title all "Moby Dick") sortby title');
      expect(result.urlParams.limit).toBe('100');
      expect(result.sameOrigin).toBe(true);
    });

    it('builds request with advanced search (searchBy undefined)', () => {
      const result = builder.build({
        query: '(title all "test" and lccn all "123")',
        searchBy: undefined,
        limit: 100,
        offset: 0,
      });

      expect(result.urlParams.query).toBe('(title all "test" and lccn all "123") sortby title');
    });

    it('uses custom sortBy when provided', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'lccn',
        limit: 50,
        sortBy: 'date',
      });

      expect(result.urlParams.query).toBe('(lccn all "test") sortby date');
    });

    it('includes offset when greater than 0', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'title',
        limit: 100,
        offset: 200,
      });

      expect(result.urlParams.offset).toBe('200');
    });

    it('omits offset when 0 or undefined', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'title',
        limit: 100,
        offset: 0,
      });

      expect(result.urlParams.offset).toBeUndefined();
    });
  });

  describe('with custom default sortBy', () => {
    it('uses custom default sortBy', () => {
      const customBuilder = new ResourcesRequestBuilder('relevance');
      const result = customBuilder.build({
        query: 'test',
        searchBy: 'keyword',
        limit: 100,
      });

      expect(result.urlParams.query).toBe('(keyword all "test") sortby relevance');
    });
  });
});
