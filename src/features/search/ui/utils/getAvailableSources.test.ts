import { getAvailableSources } from './getAvailableSources.helper';
import type { SearchTypeConfig } from '../../core/types';

describe('getAvailableSources', () => {
  const baseConfig: SearchTypeConfig = {
    id: 'test_id',
    sources: {
      source_1: { id: 'source_1' },
      source_2: { id: 'source_2' },
    },
  };

  test('returns root-level sources when no currentSegment is provided', () => {
    const result = getAvailableSources(baseConfig);

    expect(result).toEqual(baseConfig.sources);
  });

  test('returns root-level sources when currentSegment is empty string', () => {
    const result = getAvailableSources(baseConfig, '');

    expect(result).toEqual(baseConfig.sources);
  });

  test('returns root-level sources when config has no segments', () => {
    const result = getAvailableSources(baseConfig, 'browse');

    expect(result).toEqual(baseConfig.sources);
  });

  test('returns root-level sources when segment does not exist', () => {
    const configWithSegments: SearchTypeConfig = {
      ...baseConfig,
      segments: {
        search: {
          id: 'search',
          sources: {
            searchSource: { id: 'searchSource' },
          },
        },
      },
    };

    const result = getAvailableSources(configWithSegments, 'browse');

    expect(result).toEqual(baseConfig.sources);
  });

  test('returns segment-level sources when segment exists', () => {
    const segmentSources = {
      browseSources: { id: 'browseSources' },
    };

    const configWithSegments: SearchTypeConfig = {
      ...baseConfig,
      segments: {
        browse: {
          id: 'browse',
          sources: segmentSources,
        },
      },
    };

    const result = getAvailableSources(configWithSegments, 'browse');

    expect(result).toEqual(segmentSources);
  });

  test('prioritizes segment sources over root sources', () => {
    const rootSources = {
      source_1: { id: 'source_1' },
    };

    const segmentSources = {
      source_2: { id: 'source_2' },
    };

    const configWithSegments: SearchTypeConfig = {
      id: 'test',
      sources: rootSources,
      segments: {
        search: {
          id: 'search',
          sources: segmentSources,
        },
      },
    };

    const result = getAvailableSources(configWithSegments, 'search');

    expect(result).toEqual(segmentSources);
    expect(result).not.toEqual(rootSources);
  });

  test('handles segment with undefined sources', () => {
    const configWithSegments: SearchTypeConfig = {
      ...baseConfig,
      segments: {
        browse: {
          id: 'browse',
          sources: undefined,
        },
      },
    };

    const result = getAvailableSources(configWithSegments, 'browse');

    expect(result).toEqual(baseConfig.sources);
  });

  test('handles config with no root sources', () => {
    const configWithoutSources: SearchTypeConfig = {
      id: 'test',
      segments: {
        browse: {
          id: 'browse',
          sources: {
            browseSource: { id: 'browseSource' },
          },
        },
      },
    };

    const result = getAvailableSources(configWithoutSources, 'browse');

    expect(result).toEqual({
      browseSource: { id: 'browseSource' },
    });
  });

  test('returns undefined when no sources exist anywhere', () => {
    const configWithoutSources: SearchTypeConfig = {
      id: 'test',
    };

    const result = getAvailableSources(configWithoutSources);

    expect(result).toBeUndefined();
  });

  test('handles empty segment sources object', () => {
    const configWithSegments: SearchTypeConfig = {
      ...baseConfig,
      segments: {
        browse: {
          id: 'browse',
          sources: {},
        },
      },
    };

    const result = getAvailableSources(configWithSegments, 'browse');

    expect(result).toEqual({});
  });

  test('handles multiple segments correctly', () => {
    const searchSources = { searchSource: { id: 'searchSource' } };
    const browseSources = { browseSource: { id: 'browseSource' } };

    const configWithSegments: SearchTypeConfig = {
      id: 'test',
      sources: baseConfig.sources,
      segments: {
        search: {
          id: 'search',
          sources: searchSources,
        },
        browse: {
          id: 'browse',
          sources: browseSources,
        },
      },
    };

    const searchResult = getAvailableSources(configWithSegments, 'search');
    const browseResult = getAvailableSources(configWithSegments, 'browse');

    expect(searchResult).toEqual(searchSources);
    expect(browseResult).toEqual(browseSources);
  });

  test('segment sources can be different types of objects', () => {
    const complexSources = {
      complexSource: {
        id: 'complexSource',
        capabilities: {
          defaultLimit: 10,
          maxLimit: 100,
        },
      },
    };

    const configWithSegments: SearchTypeConfig = {
      id: 'test',
      sources: baseConfig.sources,
      segments: {
        complex: {
          id: 'complex',
          sources: complexSources,
        },
      },
    };

    const result = getAvailableSources(configWithSegments, 'complex');

    expect(result).toEqual(complexSources);
  });
});
