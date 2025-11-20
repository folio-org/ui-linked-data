import { SearchTypeConfig, SegmentConfig, SourceConfig } from '../types';

export function selectStrategies(config: SearchTypeConfig, segment?: string, source?: string) {
  if (segment && config.segments?.[segment]) {
    const segmentConfig = config.segments[segment];

    if (source && segmentConfig.sources?.[source]) {
      return segmentConfig.sources[source].strategies;
    }

    return segmentConfig.strategies;
  }

  if (source && config.sources?.[source]) {
    return config.sources[source].strategies;
  }

  return config.strategies;
}

export function selectActiveConfig(
  config: SearchTypeConfig,
  segment?: string,
  source?: string,
): SegmentConfig | SourceConfig | SearchTypeConfig {
  if (segment && config.segments?.[segment]) {
    const segmentConfig = config.segments[segment];

    if (source && segmentConfig.sources?.[source]) {
      return segmentConfig.sources[source];
    }

    return segmentConfig;
  }

  if (source && config.sources?.[source]) {
    return config.sources[source];
  }

  return config;
}
