import type { SearchTypeConfig } from '../../core/types';

export const getAvailableSources = (config: SearchTypeConfig, currentSegment?: string) => {
  // Check segment-level sources first
  if (currentSegment && config.segments?.[currentSegment]?.sources) {
    return config.segments[currentSegment].sources;
  }

  // Fallback to root-level sources
  return config.sources;
};
