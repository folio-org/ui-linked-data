import { getDefaultSourceForSegment } from './searchRegistry';

describe('searchRegistry', () => {
  describe('getDefaultSourceForSegment', () => {
    it('returns undefined when segment is undefined', () => {
      expect(getDefaultSourceForSegment()).toBeUndefined();
    });

    it('returns undefined for unknown segment', () => {
      expect(getDefaultSourceForSegment('unknown_segment_1')).toBeUndefined();
    });

    it('returns undefined for resources segment (no composite id)', () => {
      expect(getDefaultSourceForSegment('resources')).toBeUndefined();
    });

    it('returns undefined for hubs:local segment (segment is already composite, not segment:source)', () => {
      expect(getDefaultSourceForSegment('hubs:local')).toBeUndefined();
    });

    it('returns undefined for authorities:search segment (category:type, not segment:source)', () => {
      expect(getDefaultSourceForSegment('authorities:search')).toBeUndefined();
    });

    it('returns undefined for authorities:browse segment', () => {
      expect(getDefaultSourceForSegment('authorities:browse')).toBeUndefined();
    });

    it('returns libraryOfCongress for hubsLookup segment', () => {
      expect(getDefaultSourceForSegment('hubsLookup')).toBe('libraryOfCongress');
    });

    it('returns libraryOfCongress for hubs segment', () => {
      expect(getDefaultSourceForSegment('hubs')).toBe('libraryOfCongress');
    });
  });
});
