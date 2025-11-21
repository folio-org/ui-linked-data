import { selectStrategies, selectActiveConfig } from './configSelectors.helper';
import type { SearchTypeConfig, SegmentConfig, SourceConfig } from '../types';

describe('configSelectors.helper', () => {
  const mockRequestBuilder = {
    build: jest.fn(),
  };

  const mockResponseTransformer = {
    transform: jest.fn(),
  };

  const mockResultFormatter = {
    format: jest.fn(),
  };

  const mockBaseStrategies = {
    requestBuilder: mockRequestBuilder,
    responseTransformer: mockResponseTransformer,
    resultFormatter: mockResultFormatter,
  };

  const mockSegmentStrategies = {
    requestBuilder: { build: jest.fn() },
  };

  const mockSourceStrategies = {
    requestBuilder: { build: jest.fn() },
  };

  const mockConfig: SearchTypeConfig = {
    id: 'test-type',
    strategies: mockBaseStrategies,
    segments: {
      search: {
        id: 'search',
        strategies: mockSegmentStrategies,
        searchBy: {
          searchableIndices: [{ value: 'keyword' }],
        },
      },
      browse: {
        id: 'browse',
        searchBy: {
          searchableIndices: [{ value: 'name' }],
        },
        sources: {
          internal: {
            id: 'internal',
            strategies: mockSourceStrategies,
          },
        },
      },
    },
    sources: {
      external: {
        id: 'external',
        strategies: mockSourceStrategies,
      },
    },
  };

  describe('selectStrategies', () => {
    it('returns base strategies when no segment or source is provided', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockBaseStrategies);
    });

    it('returns segment strategies when segment is provided', () => {
      const result = selectStrategies(mockConfig, 'search');

      expect(result).toBe(mockSegmentStrategies);
    });

    it('returns base strategies when segment does not exist', () => {
      const result = selectStrategies(mockConfig, 'nonexistent');

      expect(result).toBe(mockBaseStrategies);
    });

    it('returns source strategies when source is provided at top level', () => {
      const result = selectStrategies(mockConfig, undefined, 'external');

      expect(result).toBe(mockSourceStrategies);
    });

    it('returns segment source strategies when both segment and source are provided', () => {
      const result = selectStrategies(mockConfig, 'browse', 'internal');

      expect(result).toBe(mockSourceStrategies);
    });

    it('returns segment strategies when segment exists but source does not', () => {
      const result = selectStrategies(mockConfig, 'search', 'nonexistent');

      expect(result).toBe(mockSegmentStrategies);
    });

    it('returns base strategies when segment has no strategies', () => {
      const configWithoutSegmentStrategies: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
        segments: {
          empty: {
            id: 'empty',
            searchBy: {
              searchableIndices: [{ value: 'test' }],
            },
          },
        },
      };

      const result = selectStrategies(configWithoutSegmentStrategies, 'empty');

      expect(result).toBeUndefined();
    });

    it('handles config without segments', () => {
      const configWithoutSegments: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectStrategies(configWithoutSegments, 'search');

      expect(result).toBe(mockBaseStrategies);
    });

    it('handles config without sources', () => {
      const configWithoutSources: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectStrategies(configWithoutSources, undefined, 'external');

      expect(result).toBe(mockBaseStrategies);
    });

    it('prioritizes segment over top-level source', () => {
      const result = selectStrategies(mockConfig, 'search', 'external');

      expect(result).toBe(mockSegmentStrategies);
    });
  });

  describe('selectActiveConfig', () => {
    it('returns base config when no segment or source is provided', () => {
      const result = selectActiveConfig(mockConfig);

      expect(result).toBe(mockConfig);
    });

    it('returns segment config when segment is provided', () => {
      const result = selectActiveConfig(mockConfig, 'search');

      expect(result).toBe(mockConfig.segments?.search);
      expect((result as SegmentConfig).id).toBe('search');
    });

    it('returns base config when segment does not exist', () => {
      const result = selectActiveConfig(mockConfig, 'nonexistent');

      expect(result).toBe(mockConfig);
    });

    it('returns source config when source is provided at top level', () => {
      const result = selectActiveConfig(mockConfig, undefined, 'external');

      expect(result).toBe(mockConfig.sources?.external);
      expect((result as SourceConfig).id).toBe('external');
    });

    it('returns segment source config when both segment and source are provided', () => {
      const result = selectActiveConfig(mockConfig, 'browse', 'internal');

      expect(result).toBe(mockConfig.segments?.browse?.sources?.internal);
      expect((result as SourceConfig).id).toBe('internal');
    });

    it('returns segment config when segment exists but source does not', () => {
      const result = selectActiveConfig(mockConfig, 'search', 'nonexistent');

      expect(result).toBe(mockConfig.segments?.search);
      expect((result as SegmentConfig).id).toBe('search');
    });

    it('handles config without segments', () => {
      const configWithoutSegments: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectActiveConfig(configWithoutSegments, 'search');

      expect(result).toBe(configWithoutSegments);
    });

    it('handles config without sources', () => {
      const configWithoutSources: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectActiveConfig(configWithoutSources, undefined, 'external');

      expect(result).toBe(configWithoutSources);
    });

    it('returns correct type for segment config', () => {
      const result = selectActiveConfig(mockConfig, 'search');

      expect(result).toHaveProperty('id', 'search');
      expect(result).toHaveProperty('searchBy');
    });

    it('returns correct type for source config', () => {
      const result = selectActiveConfig(mockConfig, undefined, 'external');

      expect(result).toHaveProperty('id', 'external');
      expect(result).toHaveProperty('strategies');
    });

    it('handles nested source within segment', () => {
      const result = selectActiveConfig(mockConfig, 'browse', 'internal');

      expect((result as SourceConfig).id).toBe('internal');
      expect((result as SourceConfig).strategies).toBe(mockSourceStrategies);
    });

    it('prioritizes segment over top-level source', () => {
      const result = selectActiveConfig(mockConfig, 'search', 'external');

      expect((result as SegmentConfig).id).toBe('search');
      expect(result).not.toHaveProperty('strategies', mockSourceStrategies);
    });
  });

  describe('integration tests', () => {
    it('selectStrategies and selectActiveConfig return consistent results', () => {
      const strategies = selectStrategies(mockConfig, 'search');
      const activeConfig = selectActiveConfig(mockConfig, 'search') as SegmentConfig;

      expect(strategies).toBe(activeConfig.strategies);
    });

    it('handles multi-level cascade correctly', () => {
      const strategies = selectStrategies(mockConfig, 'browse', 'internal');
      const activeConfig = selectActiveConfig(mockConfig, 'browse', 'internal') as SourceConfig;

      expect(strategies).toBe(activeConfig.strategies);
    });

    it('falls back gracefully when partial path exists', () => {
      const strategies = selectStrategies(mockConfig, 'browse', 'nonexistent');
      const activeConfig = selectActiveConfig(mockConfig, 'browse', 'nonexistent');

      // Should get browse segment config
      expect((activeConfig as SegmentConfig).id).toBe('browse');
      // Strategies should be undefined for browse (has no strategies defined)
      expect(strategies).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('handles config with empty segments object', () => {
      const configWithEmptySegments: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
        segments: {},
      };

      const strategies = selectStrategies(configWithEmptySegments, 'search');
      const activeConfig = selectActiveConfig(configWithEmptySegments, 'search');

      expect(strategies).toBe(mockBaseStrategies);
      expect(activeConfig).toBe(configWithEmptySegments);
    });

    it('handles config with empty sources object', () => {
      const configWithEmptySources: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
        sources: {},
      };

      const strategies = selectStrategies(configWithEmptySources, undefined, 'external');
      const activeConfig = selectActiveConfig(configWithEmptySources, undefined, 'external');

      expect(strategies).toBe(mockBaseStrategies);
      expect(activeConfig).toBe(configWithEmptySources);
    });

    it('handles undefined strategies in config', () => {
      const configWithoutStrategies: SearchTypeConfig = {
        id: 'test',
      };

      const strategies = selectStrategies(configWithoutStrategies);
      const activeConfig = selectActiveConfig(configWithoutStrategies);

      expect(strategies).toBeUndefined();
      expect(activeConfig).toBe(configWithoutStrategies);
    });
  });
});
