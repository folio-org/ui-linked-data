import type { SearchTypeConfig } from '../types';
import { searchRegistry } from '../config/searchRegistry';

export function resolveCoreConfig(segment?: string): SearchTypeConfig | undefined {
  if (!segment) return undefined;

  return searchRegistry[segment];
}

export function buildEffectiveConfigKey(segment: string, source?: string): string {
  if (!source) return segment;

  const compositeKey = `${segment}:${source}`;

  // Check if composite key exists in registry
  if (searchRegistry[compositeKey]) {
    return compositeKey;
  }

  // Fallback to segment-only key
  return segment;
}

export function resolveEffectiveConfig(segment?: string, source?: string): SearchTypeConfig | undefined {
  if (!segment) return undefined;

  const effectiveKey = buildEffectiveConfigKey(segment, source);

  return searchRegistry[effectiveKey];
}
