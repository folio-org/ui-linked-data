import { isSegmentActive, isParentSegmentActive } from './segmentUtils';

describe('segmentUtils', () => {
  describe('isSegmentActive', () => {
    it('returns false when currentSegment is undefined', () => {
      expect(isSegmentActive(undefined, 'resources')).toBe(false);
    });

    it('returns true for exact match without prefix matching', () => {
      expect(isSegmentActive('resources', 'resources', false)).toBe(true);
    });

    it('returns false for non-match without prefix matching', () => {
      expect(isSegmentActive('resources', 'authorities', false)).toBe(false);
    });

    it('returns true for exact match with prefix matching', () => {
      expect(isSegmentActive('authorities', 'authorities', true)).toBe(true);
    });

    it('returns true for prefix match when matchPrefix is true', () => {
      expect(isSegmentActive('authorities:search', 'authorities', true)).toBe(true);
      expect(isSegmentActive('authorities:browse', 'authorities', true)).toBe(true);
    });

    it('returns false when prefix does not match even with matchPrefix true', () => {
      expect(isSegmentActive('resources:search', 'authorities', true)).toBe(false);
    });

    it('returns false for partial prefix without colon separator', () => {
      expect(isSegmentActive('authoritiesextended', 'authorities', true)).toBe(false);
    });

    it('returns false for prefix match when matchPrefix is false', () => {
      expect(isSegmentActive('authorities:search', 'authorities', false)).toBe(false);
    });
  });

  describe('isParentSegmentActive', () => {
    it('returns false when currentSegment is undefined', () => {
      expect(isParentSegmentActive(undefined, 'authorities')).toBe(false);
    });

    it('returns true for exact parent match', () => {
      expect(isParentSegmentActive('authorities', 'authorities')).toBe(true);
    });

    it('returns true when current segment starts with parent path followed by colon', () => {
      expect(isParentSegmentActive('authorities:search', 'authorities')).toBe(true);
      expect(isParentSegmentActive('authorities:browse', 'authorities')).toBe(true);
      expect(isParentSegmentActive('authorities:search:advanced', 'authorities')).toBe(true);
    });

    it('returns false when parent path does not match', () => {
      expect(isParentSegmentActive('resources:search', 'authorities')).toBe(false);
      expect(isParentSegmentActive('hubs', 'authorities')).toBe(false);
    });

    it('returns false for partial prefix without colon separator', () => {
      expect(isParentSegmentActive('authoritiesextended', 'authorities')).toBe(false);
    });
  });
});
