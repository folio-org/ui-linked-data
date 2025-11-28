import { getSearchUIConfig, searchUIRegistry } from './searchUIRegistry';

describe('searchUIRegistry', () => {
  describe('getSearchUIConfig', () => {
    describe('basic functionality', () => {
      it('returns default config when only search type is provided', () => {
        const result = getSearchUIConfig('authorities');

        expect(result).toBeDefined();
        expect(result).toBe(searchUIRegistry.authorities);
      });

      it('returns default config when segment is undefined', () => {
        const result = getSearchUIConfig('authorities');

        expect(result).toBeDefined();
        expect(result).toBe(searchUIRegistry.authorities);
      });
    });

    describe('segment handling', () => {
      it('returns segment-specific config when segment exists', () => {
        const result = getSearchUIConfig('authorities', 'browse');

        expect(result).toBeDefined();
        expect(result).toBe(searchUIRegistry.authorities.segments?.browse);
      });

      it('returns segment search config when segment is "search"', () => {
        const result = getSearchUIConfig('authorities', 'search');

        expect(result).toBeDefined();
        expect(result).toBe(searchUIRegistry.authorities.segments?.search);
      });

      it('falls back to default when segment does not exist', () => {
        const result = getSearchUIConfig('authorities', 'nonexistent');

        expect(result).toBeDefined();
        expect(result).toBe(searchUIRegistry.authorities);
      });

      it('returns default when search type has no segments', () => {
        const result = getSearchUIConfig('hubs', 'anySegment');

        expect(result).toBeDefined();
        expect(result).toBe(searchUIRegistry.hubs);
      });
    });

    describe('config structure validation', () => {
      it('authorities default config has required properties', () => {
        const result = getSearchUIConfig('authorities');

        expect(result).toHaveProperty('ui');
        expect(result?.ui).toHaveProperty('titleId');
        expect(result).toHaveProperty('features');
        expect(result).toHaveProperty('searchableIndices');
      });

      it('authorities browse config has required properties', () => {
        const result = getSearchUIConfig('authorities', 'browse');

        expect(result).toHaveProperty('features');
        expect(result).toHaveProperty('searchableIndices');
      });

      it('hubs config has required properties', () => {
        const result = getSearchUIConfig('hubs');

        expect(result).toHaveProperty('ui');
        expect(result?.ui).toHaveProperty('titleId');
        expect(result).toHaveProperty('features');
        expect(result).toHaveProperty('searchableIndices');
      });

      it('resources config has required properties', () => {
        const result = getSearchUIConfig('resources');

        expect(result).toHaveProperty('ui');
        expect(result?.ui).toHaveProperty('titleId');
        expect(result).toHaveProperty('features');
        expect(result).toHaveProperty('searchableIndices');
      });
    });

    describe('feature flags', () => {
      it('authorities search has correct feature flags', () => {
        const result = getSearchUIConfig('authorities', 'search');

        expect(result?.features?.hasSourceToggle).toBe(false);
        expect(result?.features?.hasAdvancedSearch).toBe(false);
      });

      it('authorities browse has different feature flags', () => {
        const result = getSearchUIConfig('authorities', 'browse');

        expect(result?.features?.hasSourceToggle).toBe(false);
        expect(result?.features?.hasAdvancedSearch).toBe(false);
        expect(result?.features?.isLoopedPagination).toBe(true);
      });

      it('hubs has correct feature flags', () => {
        const result = getSearchUIConfig('hubs');

        expect(result?.features?.hasSearchBy).toBe(true);
        expect(result?.features?.hasAdvancedSearch).toBe(false);
        expect(result?.features?.isVisibleSubLabel).toBe(true);
        expect(result?.features?.isLoopedPagination).toBe(false);
      });
    });

    describe('searchable indices', () => {
      it('authorities config has searchableIndices array', () => {
        const result = getSearchUIConfig('authorities', 'search');

        expect(result?.searchableIndices).toBeDefined();
        expect(Array.isArray(result?.searchableIndices)).toBe(true);
      });

      it('authorities browse has searchableIndices array', () => {
        const result = getSearchUIConfig('authorities', 'browse');

        expect(result?.searchableIndices).toBeDefined();
        expect(Array.isArray(result?.searchableIndices)).toBe(true);
      });

      it('hubs has searchableIndices array', () => {
        const result = getSearchUIConfig('hubs');

        expect(result?.searchableIndices).toBeDefined();
        expect(Array.isArray(result?.searchableIndices)).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('handles empty string segment', () => {
        const result = getSearchUIConfig('authorities', '');

        expect(result).toBe(searchUIRegistry.authorities);
      });

      it('handles null-like values gracefully', () => {
        const result = getSearchUIConfig('authorities', null as unknown as string);

        expect(result).toBe(searchUIRegistry.authorities);
      });

      it('handles special characters in segment', () => {
        const result = getSearchUIConfig('authorities', 'br@wse');

        expect(result).toBe(searchUIRegistry.authorities);
      });
    });

    describe('consistency checks', () => {
      it('authorities search returns segment-specific config', () => {
        const defaultConfig = getSearchUIConfig('authorities');
        const searchConfig = getSearchUIConfig('authorities', 'search');

        expect(searchConfig).not.toBe(defaultConfig);
        expect(searchConfig).toHaveProperty('features');
        expect(searchConfig).toHaveProperty('searchableIndices');
      });

      it('authorities browse is different from default', () => {
        const defaultConfig = getSearchUIConfig('authorities');
        const browseConfig = getSearchUIConfig('authorities', 'browse');

        expect(browseConfig).not.toBe(defaultConfig);
      });

      it('segment config has features and searchableIndices', () => {
        const browseConfig = getSearchUIConfig('authorities', 'browse');

        expect(browseConfig).toHaveProperty('features');
        expect(browseConfig).toHaveProperty('searchableIndices');
      });
    });

    describe('type safety', () => {
      it('returns correct structure for authorities', () => {
        const result = getSearchUIConfig('authorities');

        if (result) {
          expect(typeof result.ui?.titleId).toBe('string');
          expect(typeof result.features?.hasSearchBy).toBe('boolean');
          expect(Array.isArray(result.searchableIndices)).toBe(true);
        }
      });

      it('searchable indices have correct structure', () => {
        const result = getSearchUIConfig('authorities');

        if (result?.searchableIndices) {
          for (const index of result.searchableIndices) {
            expect(index).toHaveProperty('value');
            expect(index).toHaveProperty('labelId');
            expect(typeof index.value).toBe('string');
            expect(typeof index.labelId).toBe('string');
          }
        }
      });
    });

    describe('i18n keys', () => {
      it('authorities config has titleId property', () => {
        const result = getSearchUIConfig('authorities');

        expect(result?.ui).toHaveProperty('titleId');
        expect(result?.ui).toHaveProperty('subtitleId');
        expect(result?.ui).toHaveProperty('placeholderId');
      });

      it('browse config is different from default', () => {
        const defaultResult = getSearchUIConfig('authorities');
        const browseResult = getSearchUIConfig('authorities', 'browse');

        expect(browseResult).not.toBe(defaultResult);
        expect(browseResult?.features).toBeDefined();
      });

      it('all configs have ui property with string fields', () => {
        const result = getSearchUIConfig('authorities');

        expect(typeof result?.ui?.titleId).toBe('string');
        expect(typeof result?.ui?.subtitleId).toBe('string');
        expect(typeof result?.ui?.placeholderId).toBe('string');
      });
    });
  });
});
