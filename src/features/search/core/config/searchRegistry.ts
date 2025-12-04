import type { SearchTypeConfig } from '../types';
import { resourcesConfig } from './resources.config';
import { authoritiesSearchConfig } from './authoritiesSearch.config';
import { authoritiesBrowseConfig } from './authoritiesBrowse.config';
import { hubsInternalConfig } from './hubsInternal.config';
import { hubsExternalConfig } from './hubsExternal.config';

/**
 * Atomic Search Registry
 *
 * Central registry of all atomic search configurations.
 * Each config is self-contained with its own strategies, searchBy, and defaults.
 *
 * Keys use composite notation:
 * - Simple types: "resources"
 * - Segment variants: "authorities:search", "authorities:browse"
 * - Source variants: "hubs:internal", "hubs:external"
 */
export const searchRegistry: Record<string, SearchTypeConfig> = {
  // Resources (simple type)
  resources: resourcesConfig,

  // Authorities variants
  'authorities:search': authoritiesSearchConfig,
  'authorities:browse': authoritiesBrowseConfig,

  // Hubs - base config defaults to internal
  hubs: hubsInternalConfig,
  'hubs:internal': hubsInternalConfig,
  'hubs:external': hubsExternalConfig,
};

/**
 * Get an atomic search config by composite key.
 *
 * @example
 * getSearchConfig('resources')           // Resources config
 * getSearchConfig('authorities:search')  // Authorities search config
 * getSearchConfig('hubs:external')       // Hubs external config
 */
export function getSearchConfig(key: string): SearchTypeConfig | undefined {
  return searchRegistry[key];
}

/**
 * Get all registered search config keys
 */
export function getSearchConfigKeys(): string[] {
  return Object.keys(searchRegistry);
}
