import { getActiveConfig } from './getActiveConfig.helper';
import type { SearchTypeUIConfig } from '../types';

describe('getActiveConfig', () => {
  const baseUIConfig: SearchTypeUIConfig = {
    ui: {
      titleId: 'base.label',
      placeholderId: 'base.placeholder',
    },
    features: {
      hasAdvancedSearch: true,
    },
    searchableIndices: [
      { value: 'keyword', labelId: 'keyword.label', placeholder: 'base.keyword' },
      { value: 'title', labelId: 'title.label', placeholder: 'base.title' },
    ],
  };

  describe('without segments', () => {
    it('returns base config when no segments defined', () => {
      const result = getActiveConfig(baseUIConfig, 'anySegment');

      expect(result).toEqual(baseUIConfig);
    });

    it('returns base config when currentSegment is undefined', () => {
      const configWithSegments = {
        ...baseUIConfig,
        segments: {
          search: { ui: { titleId: 'search.label' } },
        },
      };

      const result = getActiveConfig(configWithSegments);

      expect(result).toEqual(configWithSegments);
    });

    it('returns base config when currentSegment is empty string', () => {
      const configWithSegments = {
        ...baseUIConfig,
        segments: {
          search: { ui: { titleId: 'search.label' } },
        },
      };

      const result = getActiveConfig(configWithSegments, '');

      expect(result).toEqual(configWithSegments);
    });
  });

  describe('exact match', () => {
    it('merges base config with segment-specific overrides for exact match', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: {
            ui: { titleId: 'search.label' },
            features: { hasAdvancedSearch: false },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'search');

      expect(result.ui?.titleId).toBe('search.label');
      expect(result.features?.hasAdvancedSearch).toBe(false);
      expect(result.searchableIndices).toEqual(baseUIConfig.searchableIndices);
    });

    it('preserves segment-specific searchableIndices', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          browse: {
            searchableIndices: [{ value: 'name', labelId: 'name.label', placeholder: 'browse.name' }],
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'browse');

      expect(result.searchableIndices).toEqual([{ value: 'name', labelId: 'name.label', placeholder: 'browse.name' }]);
    });

    it('uses base searchableIndices when segment has none', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: {
            ui: { titleId: 'search.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'search');

      expect(result.searchableIndices).toEqual(baseUIConfig.searchableIndices);
    });
  });

  describe('composite key handling', () => {
    it('tries parent key when exact match not found', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          authorities: {
            ui: { titleId: 'authorities.label' },
            features: { hasAdvancedSearch: false },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:search');

      expect(result.ui?.titleId).toBe('authorities.label');
      expect(result.features?.hasAdvancedSearch).toBe(false);
    });

    it('prefers exact match over parent for composite key', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          authorities: {
            ui: { titleId: 'parent.authorities.label' },
          },
          'authorities:search': {
            ui: { titleId: 'exact.match.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:search');

      expect(result.ui?.titleId).toBe('exact.match.label');
    });

    it('tries child key when parent not found', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: {
            ui: { titleId: 'search.child.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:search');

      expect(result.ui?.titleId).toBe('search.child.label');
    });

    it('returns base config when neither parent nor child found', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          other: {
            ui: { titleId: 'other.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:search');

      expect(result).toEqual(configWithSegments);
    });

    it('handles deeply nested composite keys', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          authorities: {
            ui: { titleId: 'authorities.parent.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:search:advanced');

      expect(result.ui?.titleId).toBe('authorities.parent.label');
    });

    it('tries child key for deeply nested composite', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          advanced: {
            ui: { titleId: 'advanced.child.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:search:advanced');

      expect(result.ui?.titleId).toBe('advanced.child.label');
    });
  });

  describe('config merging', () => {
    it('deeply merges ui properties', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        ui: {
          titleId: 'base.label',
          placeholderId: 'base.placeholder',
        },
        segments: {
          search: {
            ui: {
              titleId: 'search.label',
              subtitleId: 'Search description',
            },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'search');

      expect(result.ui?.titleId).toBe('search.label');
      expect(result.ui?.placeholderId).toBe('base.placeholder');
      expect(result.ui?.subtitleId).toBe('Search description');
    });

    it('deeply merges features properties', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        features: {
          hasAdvancedSearch: true,
          hasSearchBy: true,
        },
        segments: {
          browse: {
            features: {
              hasSearchBy: false,
            },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'browse');

      expect(result.features?.hasAdvancedSearch).toBe(true);
      expect(result.features?.hasSearchBy).toBe(false);
    });

    it('segment config overrides base config properties', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          custom: {
            ui: { titleId: 'custom.label' },
            features: { hasAdvancedSearch: false },
            searchableIndices: [{ value: 'custom', labelId: 'custom.label' }],
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'custom');

      expect(result.ui?.titleId).toBe('custom.label');
      expect(result.features?.hasAdvancedSearch).toBe(false);
      expect(result.searchableIndices).toEqual([{ value: 'custom', labelId: 'custom.label' }]);
    });

    it('handles undefined ui in segment config', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: {
            features: { hasAdvancedSearch: false },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'search');

      expect(result.ui).toEqual(baseUIConfig.ui);
    });

    it('handles undefined features in segment config', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: {
            ui: { titleId: 'search.label' },
          },
        },
      };

      const result = getActiveConfig(configWithSegments, 'search');

      expect(result.features).toEqual(baseUIConfig.features);
    });

    it('handles undefined ui and features in base config', () => {
      const minimalConfig: SearchTypeUIConfig = {
        segments: {
          search: {
            ui: { titleId: 'search.label' },
            features: { hasAdvancedSearch: true },
          },
        },
      };

      const result = getActiveConfig(minimalConfig, 'search');

      expect(result.ui).toEqual({ titleId: 'search.label' });
      expect(result.features).toEqual({ hasAdvancedSearch: true });
    });
  });

  describe('edge cases', () => {
    it('handles null segment gracefully', () => {
      const result = getActiveConfig(baseUIConfig);

      expect(result).toEqual(baseUIConfig);
    });

    it('handles segment with only colon', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: { ui: { titleId: 'search.label' } },
        },
      };

      const result = getActiveConfig(configWithSegments, ':');

      // Should try empty string as parent and child, both fail, return base
      expect(result).toEqual(configWithSegments);
    });

    it('handles segment with trailing colon', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          authorities: { ui: { titleId: 'authorities.label' } },
        },
      };

      const result = getActiveConfig(configWithSegments, 'authorities:');

      // Parent is 'authorities', should match
      expect(result.ui?.titleId).toBe('authorities.label');
    });

    it('handles segment with leading colon', () => {
      const configWithSegments: SearchTypeUIConfig = {
        ...baseUIConfig,
        segments: {
          search: { ui: { titleId: 'search.label' } },
        },
      };

      const result = getActiveConfig(configWithSegments, ':search');

      // Child is 'search', should match
      expect(result.ui?.titleId).toBe('search.label');
    });

    it('preserves all base properties not overridden by segment', () => {
      const complexBase: SearchTypeUIConfig = {
        ui: { titleId: 'base.label' },
        features: { hasAdvancedSearch: true, hasSearchBy: true },
        searchableIndices: [{ value: 'base', labelId: 'base.label' }],
        segments: {
          search: {
            ui: { titleId: 'search.label' },
          },
        },
      };

      const result = getActiveConfig(complexBase, 'search');

      expect(result.ui?.titleId).toBe('search.label');
      expect(result.features?.hasAdvancedSearch).toBe(true);
      expect(result.features?.hasSearchBy).toBe(true);
      expect(result.searchableIndices).toEqual([{ value: 'base', labelId: 'base.label' }]);
    });
  });
});
