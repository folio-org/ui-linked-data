import { SEARCH_CHECK_QUERY_PARAM, SEARCH_OPERATOR } from '@/common/constants/search.constants';

import { buildHubLocalCheckQuery, extractOriginalIds, getIsLocalFlag, getSourceLabel } from './hubEnrichment.util';

describe('hubEnrichment.util', () => {
  describe('buildHubLocalCheckQuery', () => {
    it('builds query with single token', () => {
      const tokens = ['token_1'];

      const result = buildHubLocalCheckQuery(tokens);

      expect(result).toBe(`${SEARCH_CHECK_QUERY_PARAM.ORIGINAL_ID}="token_1"`);
    });

    it('builds query with multiple tokens using OR operator', () => {
      const tokens = ['token_1', 'token_2', 'token_3'];

      const result = buildHubLocalCheckQuery(tokens);

      expect(result).toBe(
        `${SEARCH_CHECK_QUERY_PARAM.ORIGINAL_ID}="token_1" ${SEARCH_OPERATOR.OR} ${SEARCH_CHECK_QUERY_PARAM.ORIGINAL_ID}="token_2" ${SEARCH_OPERATOR.OR} ${SEARCH_CHECK_QUERY_PARAM.ORIGINAL_ID}="token_3"`,
      );
    });

    it('returns empty string for empty tokens array', () => {
      const tokens: string[] = [];

      const result = buildHubLocalCheckQuery(tokens);

      expect(result).toBe('');
    });

    it('handles tokens with special characters', () => {
      const tokens = ['token-with-dash', 'token_with_underscore'];

      const result = buildHubLocalCheckQuery(tokens);

      expect(result).toContain('token-with-dash');
      expect(result).toContain('token_with_underscore');
      expect(result).toContain(SEARCH_OPERATOR.OR);
    });
  });

  describe('extractOriginalIds', () => {
    it('extracts originalIds from content array', () => {
      const content = [
        { id: 'id_1', originalId: 'original_1' },
        { id: 'id_2', originalId: 'original_2' },
        { id: 'id_3', originalId: 'original_3' },
      ];

      const result = extractOriginalIds(content);

      expect(result).toEqual(new Set(['original_1', 'original_2', 'original_3']));
    });

    it('returns empty set when content is undefined', () => {
      const result = extractOriginalIds();

      expect(result).toEqual(new Set());
    });

    it('returns empty set when content is empty array', () => {
      const result = extractOriginalIds([]);

      expect(result).toEqual(new Set());
    });

    it('filters out entries without originalId', () => {
      const content = [
        { id: 'id_1', originalId: 'original_1' },
        { id: 'id_2' },
        { id: 'id_3', originalId: undefined },
        { id: 'id_4', originalId: 'original_4' },
      ];

      const result = extractOriginalIds(content);

      expect(result).toEqual(new Set(['original_1', 'original_4']));
    });

    it('handles duplicate originalIds', () => {
      const content = [
        { id: 'id_1', originalId: 'original_1' },
        { id: 'id_2', originalId: 'original_1' },
        { id: 'id_3', originalId: 'original_2' },
      ];

      const result = extractOriginalIds(content);

      expect(result).toEqual(new Set(['original_1', 'original_2']));
      expect(result.size).toBe(2);
    });

    it('handles empty strings as originalId', () => {
      const content = [
        { id: 'id_1', originalId: '' },
        { id: 'id_2', originalId: 'original_2' },
      ];

      const result = extractOriginalIds(content);

      expect(result).toEqual(new Set(['original_2']));
    });
  });

  describe('getIsLocalFlag', () => {
    it('returns true when isLocal is true', () => {
      const hubEntry = { isLocal: true } as HubSearchResultDTO & { isLocal: boolean };

      const result = getIsLocalFlag(hubEntry);

      expect(result).toBe(true);
    });

    it('returns false when isLocal is false', () => {
      const hubEntry = { isLocal: false } as HubSearchResultDTO & { isLocal: boolean };

      const result = getIsLocalFlag(hubEntry);

      expect(result).toBe(false);
    });

    it('returns false when isLocal property is not present', () => {
      const hubEntry = {} as HubSearchResultDTO;

      const result = getIsLocalFlag(hubEntry);

      expect(result).toBe(false);
    });

    it('returns false when hubEntry has other properties but no isLocal', () => {
      const hubEntry = {
        suggestLabel: 'Test Label',
        uri: 'http://example.com',
        token: 'token_1',
      } as HubSearchResultDTO;

      const result = getIsLocalFlag(hubEntry);

      expect(result).toBe(false);
    });
  });

  describe('getSourceLabel', () => {
    it('returns local source label when isLocal is true', () => {
      const result = getSourceLabel(true);

      expect(result).toBe('ld.source.libraryOfCongress.local');
    });

    it('returns default source label when isLocal is false', () => {
      const result = getSourceLabel(false);

      expect(result).toBe('ld.source.libraryOfCongress');
    });
  });
});
