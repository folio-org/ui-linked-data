import { selectStrategies } from './configSelectors.helper';
import type { SearchTypeConfig } from '../types';

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
  };

  describe('selectStrategies', () => {
    it('returns base strategies when no segment or source is provided', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockBaseStrategies);
    });

    it('returns segment strategies when segment is provided', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockSegmentStrategies);
    });

    it('returns base strategies when segment does not exist', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockBaseStrategies);
    });

    it('returns source strategies when source is provided at top level', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockSourceStrategies);
    });

    it('returns segment source strategies when both segment and source are provided', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockSourceStrategies);
    });

    it('returns segment strategies when segment exists but source does not', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockSegmentStrategies);
    });

    it('returns base strategies when segment has no strategies', () => {
      const configWithoutSegmentStrategies: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectStrategies(configWithoutSegmentStrategies);

      expect(result).toBeUndefined();
    });

    it('handles config without segments', () => {
      const configWithoutSegments: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectStrategies(configWithoutSegments);

      expect(result).toBe(mockBaseStrategies);
    });

    it('handles config without sources', () => {
      const configWithoutSources: SearchTypeConfig = {
        id: 'test',
        strategies: mockBaseStrategies,
      };

      const result = selectStrategies(configWithoutSources);

      expect(result).toBe(mockBaseStrategies);
    });

    it('prioritizes segment over top-level source', () => {
      const result = selectStrategies(mockConfig);

      expect(result).toBe(mockSegmentStrategies);
    });
  });
});
