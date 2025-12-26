import { buildSearchUrlParams, haveSearchValuesChanged } from './searchSubmitHelpers';
import { SearchParam } from '../../core';

describe('searchSubmitHelpers', () => {
  describe('buildSearchUrlParams', () => {
    it('builds URL params with all values provided', () => {
      const result = buildSearchUrlParams('work', 'test query', 'keyword', 'local');

      expect(result.get(SearchParam.SEGMENT)).toBe('work');
      expect(result.get(SearchParam.QUERY)).toBe('test query');
      expect(result.get(SearchParam.SEARCH_BY)).toBe('keyword');
      expect(result.get(SearchParam.SOURCE)).toBe('local');
    });

    it('builds URL params without searchBy for advanced search', () => {
      const result = buildSearchUrlParams('work', 'title=test', '', 'local');

      expect(result.get(SearchParam.SEGMENT)).toBe('work');
      expect(result.get(SearchParam.QUERY)).toBe('title=test');
      expect(result.get(SearchParam.SEARCH_BY)).toBeNull();
      expect(result.get(SearchParam.SOURCE)).toBe('local');
    });

    it('builds URL params without source', () => {
      const result = buildSearchUrlParams('work', 'test query', 'keyword', undefined);

      expect(result.get(SearchParam.SEGMENT)).toBe('work');
      expect(result.get(SearchParam.QUERY)).toBe('test query');
      expect(result.get(SearchParam.SEARCH_BY)).toBe('keyword');
      expect(result.get(SearchParam.SOURCE)).toBeNull();
    });

    it('builds URL params with only required values', () => {
      const result = buildSearchUrlParams('work', 'test', '', undefined);

      expect(result.get(SearchParam.SEGMENT)).toBe('work');
      expect(result.get(SearchParam.QUERY)).toBe('test');
      expect(result.get(SearchParam.SEARCH_BY)).toBeNull();
      expect(result.get(SearchParam.SOURCE)).toBeNull();
    });

    it('builds URL params with empty segment and query', () => {
      const result = buildSearchUrlParams('', '', '', undefined);

      expect(result.get(SearchParam.SEGMENT)).toBeNull();
      expect(result.get(SearchParam.QUERY)).toBeNull();
      expect(result.get(SearchParam.SEARCH_BY)).toBeNull();
      expect(result.get(SearchParam.SOURCE)).toBeNull();
    });
  });

  describe('haveSearchValuesChanged', () => {
    it('returns true when segment changes', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };
      const updated = { segment: 'instance', query: 'test', searchBy: 'keyword', source: 'local' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(true);
    });

    it('returns true when query changes', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };
      const updated = { segment: 'work', query: 'updated', searchBy: 'keyword', source: 'local' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(true);
    });

    it('returns true when searchBy changes', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };
      const updated = { segment: 'work', query: 'test', searchBy: 'title', source: 'local' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(true);
    });

    it('returns true when source changes', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };
      const updated = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'remote' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(true);
    });

    it('returns false when no values change', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };
      const updated = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(false);
    });

    it('normalizes null and undefined source values', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: null };
      const updated = { segment: 'work', query: 'test', searchBy: 'keyword', source: undefined };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(false);
    });

    it('returns true when source changes from null to a value', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: null };
      const updated = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(true);
    });

    it('returns true when source changes from undefined to a value', () => {
      const current = { segment: 'work', query: 'test', searchBy: 'keyword', source: undefined };
      const updated = { segment: 'work', query: 'test', searchBy: 'keyword', source: 'local' };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(true);
    });

    it('handles null values in all fields', () => {
      const current = { segment: null, query: null, searchBy: null, source: null };
      const updated = { segment: null, query: null, searchBy: null, source: null };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(false);
    });

    it('handles undefined values in all fields', () => {
      const current = { segment: undefined, query: undefined, searchBy: undefined, source: undefined };
      const updated = { segment: undefined, query: undefined, searchBy: undefined, source: undefined };

      const result = haveSearchValuesChanged(current, updated);

      expect(result).toBe(false);
    });
  });
});
