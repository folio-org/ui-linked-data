import { LDAuthoritiesRequestBuilder } from './LDAuthoritiesRequestBuilder';

describe('LDAuthoritiesRequestBuilder', () => {
  describe('without searchable indices map', () => {
    const builder = new LDAuthoritiesRequestBuilder();

    it('builds request with fallback label query and default sort', () => {
      const result = builder.build({
        query: 'Shakespeare',
        searchBy: 'keyword',
        limit: 100,
        offset: 0,
      });

      expect(result.url).toBe('/search/linked-data/authorities');
      expect(result.urlParams.query).toBe('(label all "Shakespeare") sortby title');
      expect(result.urlParams.limit).toBe('100');
      expect(result.sameOrigin).toBe(true);
    });

    it('defaults searchBy to keyword when not provided', () => {
      const result = builder.build({ query: 'test', limit: 50 });

      expect(result.urlParams.query).toBe('(label all "test") sortby title');
    });

    it('includes offset when greater than 0', () => {
      const result = builder.build({ query: 'test', searchBy: 'keyword', limit: 100, offset: 20 });

      expect(result.urlParams.offset).toBe('20');
    });

    it('omits offset when 0', () => {
      const result = builder.build({ query: 'test', searchBy: 'keyword', limit: 100, offset: 0 });

      expect(result.urlParams.offset).toBeUndefined();
    });
  });

  describe('with searchable indices map', () => {
    const mockMap: SearchableIndicesMap = {
      search: {
        personalName: { query: 'personalName all ":value"' },
      } as SearchableIndexEntries,
      browse: {} as SearchableIndexEntries,
    };

    it('uses template from searchable indices map and appends sort clause', () => {
      const builder = new LDAuthoritiesRequestBuilder(mockMap);
      const result = builder.build({ query: 'Shakespeare', searchBy: 'personalName', limit: 100 });

      expect(result.urlParams.query).toBe('personalName all "Shakespeare" sortby title');
    });

    it('falls back to label query when searchBy is not in map', () => {
      const builder = new LDAuthoritiesRequestBuilder(mockMap);
      const result = builder.build({ query: 'test', searchBy: 'unknownField', limit: 100 });

      expect(result.urlParams.query).toBe('(label all "test") sortby title');
    });
  });

  describe('custom defaultSortBy', () => {
    it('uses the provided defaultSortBy in every query', () => {
      const builder = new LDAuthoritiesRequestBuilder(undefined, 'label');
      const result = builder.build({ query: 'test', searchBy: 'keyword', limit: 10 });

      expect(result.urlParams.query).toContain('sortby label');
    });
  });
});
