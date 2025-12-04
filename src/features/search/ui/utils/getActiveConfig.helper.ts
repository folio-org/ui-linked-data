import type { SearchTypeUIConfig, SegmentUIConfig } from '../types';

/**
 * Get the active UI configuration based on the current segment.
 *
 * Supports composite keys (e.g., "authorities:search"):
 * 1. Try exact match first (e.g., "authorities:search")
 * 2. If no match and composite key, try parent (e.g., "authorities")
 * 3. Fall back to base uiConfig
 */
export const getActiveConfig = (
  uiConfig: SearchTypeUIConfig,
  currentSegment?: string,
): SearchTypeUIConfig & SegmentUIConfig => {
  if (!currentSegment || !uiConfig.segments) {
    return uiConfig;
  }

  // Try exact match first
  let segmentUIConfig = uiConfig.segments[currentSegment];

  // If no exact match and composite key, try parent
  if (!segmentUIConfig && currentSegment.includes(':')) {
    const parentKey = currentSegment.split(':')[0];
    segmentUIConfig = uiConfig.segments[parentKey];

    // Also try the child key alone (e.g., "search" for "authorities:search")
    if (!segmentUIConfig) {
      const childKey = currentSegment.split(':').pop();

      if (childKey) {
        segmentUIConfig = uiConfig.segments[childKey];
      }
    }
  }

  if (!segmentUIConfig) {
    return uiConfig;
  }

  // Merge base + segment configs (segment overrides base)
  return {
    ...uiConfig,
    ...segmentUIConfig,
    ui: {
      ...uiConfig.ui,
      ...segmentUIConfig.ui,
    },
    features: {
      ...uiConfig.features,
      ...segmentUIConfig.features,
    },
    // Preserve segment-specific searchableIndices if defined
    searchableIndices: segmentUIConfig.searchableIndices ?? uiConfig.searchableIndices,
  };
};
