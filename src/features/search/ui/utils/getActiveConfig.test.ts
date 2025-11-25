import { getActiveConfig } from './getActiveConfig.helper';
import type { SearchTypeUIConfig } from '../types/ui.types';

describe('getActiveConfig', () => {
  const baseUIConfig: SearchTypeUIConfig = {
    ui: {
      emptyStateId: 'ld.enterSearchCriteria',
    },
    features: {
      hasSegments: true,
      hasSearchBy: true,
      hasQueryInput: true,
      hasSubmitButton: true,
    },
  };

  test('returns base config when no currentSegment is provided', () => {
    const result = getActiveConfig(baseUIConfig);

    expect(result).toEqual(baseUIConfig);
  });

  test('returns base config when currentSegment is empty string', () => {
    const result = getActiveConfig(baseUIConfig, '');

    expect(result).toEqual(baseUIConfig);
  });

  test('returns base config when uiConfig has no segments', () => {
    const result = getActiveConfig(baseUIConfig, 'browse');

    expect(result).toEqual(baseUIConfig);
  });

  test('returns base config when segment does not exist in segments object', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        search: {
          ui: {
            emptyStateId: 'ld.searchPlaceholder',
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'browse');

    expect(result).toEqual(configWithSegments);
  });

  test('merges base config with segment config when segment exists', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        browse: {
          ui: {
            emptyStateId: 'ld.browsePlaceholder',
          },
          features: {
            hasAdvancedSearch: false,
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'browse');

    expect(result.ui?.emptyStateId).toBe('ld.browsePlaceholder');
    expect(result.features?.hasAdvancedSearch).toBe(false);
    expect(result.features?.hasSegments).toBe(true); // From base config
  });

  test('segment config overrides base config for matching properties', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ui: {
        emptyStateId: 'ld.base',
      },
      features: {
        hasSegments: true,
        hasSearchBy: true,
      },
      segments: {
        browse: {
          ui: {
            emptyStateId: 'ld.override',
          },
          features: {
            hasSearchBy: false,
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'browse');

    expect(result.ui?.emptyStateId).toBe('ld.override');
    expect(result.features?.hasSearchBy).toBe(false);
    expect(result.features?.hasSegments).toBe(true);
  });

  test('handles segment config with only ui properties', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        search: {
          ui: {
            emptyStateId: 'ld.searchOnly',
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'search');

    expect(result.ui?.emptyStateId).toBe('ld.searchOnly');
    expect(result.features).toEqual(baseUIConfig.features);
  });

  test('handles segment config with only features properties', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        browse: {
          features: {
            hasAdvancedSearch: true,
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'browse');

    expect(result.ui).toEqual(baseUIConfig.ui);
    expect(result.features?.hasAdvancedSearch).toBe(true);
  });

  test('handles empty segment config', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        empty: {},
      },
    };

    const result = getActiveConfig(configWithSegments, 'empty');

    expect(result.ui).toEqual(baseUIConfig.ui);
    expect(result.features).toEqual(baseUIConfig.features);
  });

  test('preserves segment config in returned object', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        browse: {
          ui: {
            emptyStateId: 'ld.browse',
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'browse');

    expect(result.segments).toBeDefined();
    expect(result.segments?.browse).toBeDefined();
  });

  test('handles multiple segments but returns only for requested segment', () => {
    const configWithSegments: SearchTypeUIConfig = {
      ...baseUIConfig,
      segments: {
        search: {
          ui: {
            emptyStateId: 'ld.search',
          },
        },
        browse: {
          ui: {
            emptyStateId: 'ld.browse',
          },
        },
      },
    };

    const result = getActiveConfig(configWithSegments, 'browse');

    expect(result.ui?.emptyStateId).toBe('ld.browse');
  });
});
