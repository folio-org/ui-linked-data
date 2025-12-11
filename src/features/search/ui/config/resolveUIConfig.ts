import type { SearchTypeUIConfig } from '../types';
import { searchUIRegistry } from './searchUIRegistry';
import { getActiveConfig } from '../utils';

export function getUIRegistryKey(segment: string): keyof typeof searchUIRegistry | undefined {
  if (!segment || typeof segment !== 'string') {
    return undefined;
  }

  const parentKey = segment.includes(':') ? segment.split(':')[0] : segment;

  if (parentKey in searchUIRegistry) {
    return parentKey as keyof typeof searchUIRegistry;
  }

  return undefined;
}

export function resolveUIConfig(segment: string): SearchTypeUIConfig | undefined {
  const registryKey = getUIRegistryKey(segment);

  if (!registryKey) {
    return undefined;
  }

  const baseUIConfig = searchUIRegistry[registryKey];

  if (!baseUIConfig) {
    return undefined;
  }

  // Use getActiveConfig to merge base with segment-specific overrides
  return getActiveConfig(baseUIConfig, segment);
}

export function getDefaultUISegment(uiConfig: SearchTypeUIConfig): string | undefined {
  if (!uiConfig.segments) {
    return undefined;
  }

  const segmentKeys = Object.keys(uiConfig.segments);

  return segmentKeys.length > 0 ? segmentKeys[0] : undefined;
}
