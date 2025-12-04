import type { SearchTypeConfig } from '../types';
import { searchRegistry } from '../config';

export function resolveCoreConfig(segment?: string): SearchTypeConfig | undefined {
  if (!segment) return undefined;

  return searchRegistry[segment];
}
