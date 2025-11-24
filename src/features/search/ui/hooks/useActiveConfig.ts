import { useMemo } from 'react';
import type { SearchTypeUIConfig } from '../types';

/**
 * Resolve active UI config based on current segment
 *
 * Logic:
 * - If no segment or no segment configs → return base config
 * - If segment has config → merge base + segment (segment overrides base)
 * - Otherwise → return base config
 *
 * This is a pure computation, no side effects
 */
export const useActiveConfig = (uiConfig: SearchTypeUIConfig, currentSegment?: string): SearchTypeUIConfig => {
  return useMemo((): SearchTypeUIConfig => {
    if (!currentSegment || !uiConfig.segments) {
      return uiConfig;
    }

    const segmentUIConfig = uiConfig.segments[currentSegment];
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
    };
  }, [uiConfig, currentSegment]);
};
