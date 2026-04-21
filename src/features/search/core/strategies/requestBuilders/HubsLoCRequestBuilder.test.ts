import { SearchableIndex, SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

import { HubsLoCRequestBuilder } from './HubsLoCRequestBuilder';

describe('HubsLoCRequestBuilder', () => {
  describe('without searchable indices map', () => {
    const builder = new HubsLoCRequestBuilder();

    it('builds request with default fallback query params', () => {
      const result = builder.build({
        query: 'test hub',
        searchBy: 'hubNameKeyword',
        limit: 100,
        offset: 0,
      });

      expect(result.url).toBe('https://id.loc.gov/resources/hubs/suggest2/');
      expect(result.urlParams.q).toBe('test hub');
      expect(result.urlParams.count).toBe('100');
      expect(result.sameOrigin).toBe(false);
    });

    it('uses default searchBy when not provided', () => {
      const result = builder.build({
        query: 'test',
        limit: 50,
      });

      expect(result.urlParams.q).toBe('test');
    });

    it('includes offset when greater than 0', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'hubNameKeyword',
        limit: 100,
        offset: 50,
      });

      expect(result.urlParams.offset).toBe('50');
    });

    it('omits offset when 0', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'hubNameKeyword',
        limit: 100,
        offset: 0,
      });

      expect(result.urlParams.offset).toBeUndefined();
    });
  });

  describe('with searchable indices map', () => {
    const mockMap: HubSearchableIndicesMap = {
      [SearchableIndex.HubNameKeyword]: {
        [SearchableIndexQuerySelector.Query]: {
          paramName: 'label',
          additionalParams: { rdftype: 'Hub' },
        },
      },
    };

    it('uses config from searchable indices map', () => {
      const builder = new HubsLoCRequestBuilder(mockMap);
      const result = builder.build({
        query: 'test hub',
        searchBy: SearchableIndex.HubNameKeyword,
        limit: 100,
      });

      expect(result.urlParams.label).toBe('test hub');
      expect(result.urlParams.rdftype).toBe('Hub');
      expect(result.urlParams.count).toBe('100');
    });

    it('falls back to hubNameKeyword when searchBy not in map', () => {
      const builder = new HubsLoCRequestBuilder(mockMap);
      const result = builder.build({
        query: 'test',
        searchBy: 'unknownField',
        limit: 100,
      });

      expect(result.urlParams.label).toBe('test');
      expect(result.urlParams.rdftype).toBe('Hub');
      expect(result.urlParams.q).toBeUndefined();
    });
  });

  describe('uses count instead of limit', () => {
    it('uses count parameter for pagination', () => {
      const builder = new HubsLoCRequestBuilder();
      const result = builder.build({
        query: 'test',
        limit: 25,
      });

      expect(result.urlParams.count).toBe('25');
      expect(result.urlParams.limit).toBeUndefined();
    });
  });
});
