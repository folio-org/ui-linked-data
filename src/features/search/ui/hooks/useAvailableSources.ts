import { useMemo } from 'react';
import type { SearchTypeConfig } from '../../core/types';

/**
 * Resolve available sources dynamically
 *
 * Logic:
 * - Check segment-level sources first
 * - Fallback to root-level sources
 *
 * This is a pure computation, no side effects
 */
export const useAvailableSources = (
  config: SearchTypeConfig,
  currentSegment?: string,
): Record<string, unknown> | undefined => {
  return useMemo(() => {
    // Check segment-level sources first
    if (currentSegment && config.segments?.[currentSegment]?.sources) {
      return config.segments[currentSegment].sources;
    }

    // Fallback to root-level sources
    return config.sources;
  }, [config, currentSegment]);
};
