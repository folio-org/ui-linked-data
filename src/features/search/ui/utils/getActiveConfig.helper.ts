import type { SearchTypeUIConfig } from '../types';

export const getActiveConfig = (uiConfig: SearchTypeUIConfig, currentSegment?: string) => {
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
};
