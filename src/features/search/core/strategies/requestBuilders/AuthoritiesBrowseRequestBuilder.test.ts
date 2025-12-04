import { AuthoritiesBrowseRequestBuilder } from './AuthoritiesBrowseRequestBuilder';

describe('AuthoritiesBrowseRequestBuilder', () => {
  describe('without searchable indices map', () => {
    const builder = new AuthoritiesBrowseRequestBuilder();

    it('builds request with fallback browse query', () => {
      const result = builder.build({
        query: 'Shakespeare',
        searchBy: 'personalName',
        limit: 100,
        offset: 0,
      });

      expect(result.url).toBe('/browse/authorities');
      expect(result.urlParams.query).toBe('(headingRef>="Shakespeare" or headingRef<"Shakespeare")');
      expect(result.urlParams.limit).toBe('100');
      expect(result.urlParams.precedingRecordsCount).toBe('5');
      expect(result.sameOrigin).toBe(true);
    });

    it('uses custom precedingRecordsCount when provided', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'keyword',
        limit: 100,
        precedingRecordsCount: 10,
      });

      expect(result.urlParams.precedingRecordsCount).toBe('10');
    });

    it('uses default searchBy when not provided', () => {
      const result = builder.build({
        query: 'test',
        limit: 50,
      });

      expect(result.urlParams.query).toBe('(headingRef>="test" or headingRef<"test")');
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
      search: {} as SearchableIndexEntries,
      browse: {
        personalName: {
          query: 'headingRef>=":value"',
        },
      } as SearchableIndexEntries,
    };

    it('uses template from searchable indices map', () => {
      const builder = new AuthoritiesBrowseRequestBuilder(mockMap);
      const result = builder.build({
        query: 'Shakespeare',
        searchBy: 'personalName',
        limit: 100,
      });

      expect(result.urlParams.query).toBe('headingRef>="Shakespeare"');
    });

    it('falls back to browse query when searchBy not in map', () => {
      const builder = new AuthoritiesBrowseRequestBuilder(mockMap);
      const result = builder.build({
        query: 'test',
        searchBy: 'unknownField',
        limit: 100,
      });

      expect(result.urlParams.query).toBe('(headingRef>="test" or headingRef<"test")');
    });
  });

  describe('with custom default precedingRecordsCount', () => {
    it('uses custom default precedingRecordsCount', () => {
      const builder = new AuthoritiesBrowseRequestBuilder(undefined, 10);
      const result = builder.build({
        query: 'test',
        searchBy: 'keyword',
        limit: 100,
      });

      expect(result.urlParams.precedingRecordsCount).toBe('10');
    });
  });
});
