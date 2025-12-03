import { AuthoritiesSearchRequestBuilder } from './AuthoritiesSearchRequestBuilder';

describe('AuthoritiesSearchRequestBuilder', () => {
  describe('without searchable indices map', () => {
    const builder = new AuthoritiesSearchRequestBuilder();

    it('builds request with fallback CQL query', () => {
      const result = builder.build({
        query: 'Shakespeare',
        searchBy: 'personalName',
        limit: 100,
        offset: 0,
      });

      expect(result.url).toBe('/search/authorities');
      expect(result.urlParams.query).toBe('(personalName all "Shakespeare")');
      expect(result.urlParams.limit).toBe('100');
      expect(result.sameOrigin).toBe(true);
    });

    it('uses default searchBy when not provided', () => {
      const result = builder.build({
        query: 'test',
        limit: 50,
      });

      expect(result.urlParams.query).toBe('(keyword all "test")');
    });

    it('includes offset when greater than 0', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'keyword',
        limit: 100,
        offset: 50,
      });

      expect(result.urlParams.offset).toBe('50');
    });
  });

  describe('with searchable indices map', () => {
    const mockMap: SearchableIndicesMap = {
      search: {
        personalName: {
          query: 'personalName all ":value"',
        },
      } as SearchableIndexEntries,
      browse: {} as SearchableIndexEntries,
    };

    it('uses template from searchable indices map', () => {
      const builder = new AuthoritiesSearchRequestBuilder(mockMap);
      const result = builder.build({
        query: 'Shakespeare',
        searchBy: 'personalName',
        limit: 100,
      });

      expect(result.urlParams.query).toBe('personalName all "Shakespeare"');
    });

    it('falls back to simple CQL when searchBy not in map', () => {
      const builder = new AuthoritiesSearchRequestBuilder(mockMap);
      const result = builder.build({
        query: 'test',
        searchBy: 'unknownField',
        limit: 100,
      });

      expect(result.urlParams.query).toBe('(unknownField all "test")');
    });
  });
});
