import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import { SearchableIndex } from '@/common/constants/searchableIndex.constants';

import { HubsLocalRequestBuilder } from './HubsLocalRequestBuilder';

describe('HubsLocalRequestBuilder', () => {
  describe('with searchableIndicesMap', () => {
    const mockSearchableIndicesMap: HubSearchableIndicesMap = {
      [SearchableIndex.HubNameKeyword]: {
        query: {
          paramName: 'label',
          additionalParams: {},
        },
      },
    };

    let builder: HubsLocalRequestBuilder;

    beforeEach(() => {
      builder = new HubsLocalRequestBuilder(mockSearchableIndicesMap);
    });

    it('Builds request with configured param name', () => {
      const result = builder.build({
        query: 'horses',
        searchBy: SearchableIndex.HubNameKeyword,
        limit: 50,
        offset: 0,
      });

      expect(result).toEqual({
        url: SEARCH_API_ENDPOINT.HUBS_LOCAL,
        urlParams: {
          query: 'label="horses"',
          limit: '50',
        },
        sameOrigin: true,
      });
    });

    it('Includes offset when provided and greater than 0', () => {
      const result = builder.build({
        query: 'test',
        searchBy: SearchableIndex.HubNameKeyword,
        limit: 50,
        offset: 100,
      });

      expect(result.urlParams).toEqual({
        query: 'label="test"',
        limit: '50',
        offset: '100',
      });
    });

    it('Does not include offset when 0', () => {
      const result = builder.build({
        query: 'test',
        searchBy: SearchableIndex.HubNameKeyword,
        limit: 50,
        offset: 0,
      });

      expect(result.urlParams).toEqual({
        query: 'label="test"',
        limit: '50',
      });
    });

    it('Uses default searchBy when not provided', () => {
      const result = builder.build({
        query: 'default',
        limit: 50,
      });

      expect(result.urlParams.query).toBe('label="default"');
    });

    it('Handles queries with special characters', () => {
      const result = builder.build({
        query: 'horse & hound',
        searchBy: SearchableIndex.HubNameKeyword,
        limit: 50,
      });

      expect(result.urlParams.query).toBe('label="horse & hound"');
    });
  });

  describe('without searchableIndicesMap', () => {
    let builder: HubsLocalRequestBuilder;

    beforeEach(() => {
      builder = new HubsLocalRequestBuilder();
    });

    it('Uses default label query when no map provided', () => {
      const result = builder.build({
        query: 'test',
        searchBy: SearchableIndex.HubNameKeyword,
        limit: 50,
      });

      expect(result.urlParams.query).toBe('label="test"');
    });

    it('Uses default label query for unknown searchBy', () => {
      const result = builder.build({
        query: 'test',
        searchBy: 'unknown_index',
        limit: 50,
      });

      expect(result.urlParams.query).toBe('label="test"');
    });
  });

  describe('sameOrigin', () => {
    it('Sets sameOrigin to true', () => {
      const builder = new HubsLocalRequestBuilder();
      const result = builder.build({
        query: 'test',
        limit: 50,
      });

      expect(result.sameOrigin).toBe(true);
    });
  });

  describe('baseUrl', () => {
    it('Uses HUBS_LOCAL endpoint', () => {
      const builder = new HubsLocalRequestBuilder();
      const result = builder.build({
        query: 'test',
        limit: 50,
      });

      expect(result.url).toBe(SEARCH_API_ENDPOINT.HUBS_LOCAL);
    });
  });
});
